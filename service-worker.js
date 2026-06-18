
// ======================================
// CACHE VERSION
// PHASE 27I
// ======================================

const APP_VERSION =
    "27i-001";

const CACHE_PREFIX =
    "bible-repository";

const CORE_CACHE =
    `${CACHE_PREFIX}-core-${APP_VERSION}`;

const DOCUMENT_CACHE =
    `${CACHE_PREFIX}-documents-v1`;

const OFFLINE_FALLBACK =
    "./offline.html";

const CORE_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
	"./icons/icon-192.png",
	"./icons/icon-512.png",
    "./Code/basis/app.js",
    "./Code/basis/config.js",
    "./Code/basis/document-errors.js",
    "./Code/basis/document-load-request.js",
    "./Code/basis/document-pipeline.js",
    "./Code/basis/document-repository.js",
    "./Code/basis/document-service.js",
    "./Code/basis/document-session.js",
    "./Code/basis/dom.js",
    "./Code/basis/event-bus.js",
    "./Code/basis/event-names.js",
    "./Code/basis/events.js",
    "./Code/basis/file-service.js",
    "./Code/basis/Navigationlist.js",
    "./Code/basis/navigation.js",
    "./Code/basis/rendering.js",
    "./Code/basis/router.js",
    "./Code/basis/scroll.js",
    "./Code/basis/search.js",
    "./Code/basis/shortcuts.js",
    "./Code/basis/storage.js",
    "./Code/basis/state.js",
    "./Code/basis/template-service.js",
    "./Code/basis/ui.js",
    "./Code/basis/template.html",
    "./Code/template.html",
    "./Code/basis/style28.css",
    "./Code/favicon.ico",
    "./Code/css4.css"
   
    
];



// ======================================
// HELPERS
// ======================================
function isCoreFile(request) {
    const requestUrl =
        new URL(request.url);

    return CORE_FILES.some(file => {
        const fileUrl =
            new URL(file, self.location.origin + "/");

        return requestUrl.href === fileUrl.href;
    });
}

function isDocumentFile(request) {
    const url =
        new URL(request.url);

    if(request.method !== "GET"){
        return false;
    }

    if(url.origin !== self.location.origin){
        return false;
    }

      return (
        url.pathname.includes("/WEB/Epistles") ||
        url.pathname.includes("/WEB/Gospel") ||
        url.pathname.includes("/WEB/History") ||
        url.pathname.includes("/WEB/Law") ||
        url.pathname.includes("/WEB/Poetry") ||
        url.pathname.includes("/WEB/Prophets")
        
    );
}

async function cacheFirst(request, cacheName) {
    const cachedResponse =
        await caches.match(request);

    if(cachedResponse){
        return cachedResponse;
    }

    const networkResponse =
        await fetch(request);

    const cache =
        await caches.open(cacheName);

    cache.put(
        request,
        networkResponse.clone()
    );

    return networkResponse;
}

async function networkFirstDocument(request) {
    const cache =
        await caches.open(DOCUMENT_CACHE);

    try {
        const networkResponse =
            await fetch(request);

        if(networkResponse && networkResponse.ok){
            cache.put(
                request,
                networkResponse.clone()
            );
        }

        return networkResponse;
    }
    catch(error){
        const cachedResponse =
            await cache.match(request);

        if(cachedResponse){
            return cachedResponse;
        }

        const fallbackResponse =
            await caches.match(OFFLINE_FALLBACK);

        if(fallbackResponse){
            return fallbackResponse;
        }

        return new Response(
            "Offline. This document has not been cached yet.",
            {
                status: 503,
                headers: {
                    "Content-Type": "text/plain"
                }
            }
        );
    }
}
async function rebuildCoreCache() {
    const cache =
        await caches.open(CORE_CACHE);

    for(const file of CORE_FILES){
        try {
            await cache.add(file);
            console.log(
                "[ServiceWorker] Rebuilt cache:",
                file
            );
        }
        catch(error){
            console.error(
                "[ServiceWorker] Rebuild failed:",
                file,
                error
            );
        }
    }
}
self.addEventListener(
    "message",
    event => {
        if(!event.data){
            return;
        }

        if(event.data.type === "REBUILD_CORE_CACHE"){
            event.waitUntil(
                rebuildCoreCache()
            );
        }
    }
);

self.addEventListener(
    "install",
    event => {
        event.waitUntil(
            caches
                .open(CORE_CACHE)
                .then(cache => {
                    return cache.addAll(CORE_FILES);
                })
        );

        self.skipWaiting();
    }
);

// ======================================
// ACTIVATE
// Delete old core caches, keep document cache
// ======================================

self.addEventListener(
    "activate",
    event => {
        event.waitUntil(
            caches
                .keys()
                .then(keys => {
                    return Promise.all(
                        keys
                            .filter(key => {
                                const isThisCoreCache =
                                    key === CORE_CACHE;

                                const isDocumentCache =
                                    key === DOCUMENT_CACHE;

                                const isOldCoreCache =
                                    key.startsWith(
                                        `${CACHE_PREFIX}-core-`
                                    ) && !isThisCoreCache;

                                return (
                                    isOldCoreCache ||
                                    (
                                        key.startsWith(CACHE_PREFIX) &&
                                        !isThisCoreCache &&
                                        !isDocumentCache
                                    )
                                );
                            })
                            .map(key => caches.delete(key))
                    );
                })
                .then(() => self.clients.claim())
        );
    }
);

self.addEventListener(
    "fetch",
    event => {
        if(event.request.method !== "GET"){
            return;
        }

        if(isDocumentFile(event.request)){
            event.respondWith(
                networkFirstDocument(event.request)
            );
            return;
        }

        if(isCoreFile(event.request)){
            event.respondWith(
                cacheFirst(
                    event.request,
                    CORE_CACHE
                )
            );
            return;
        }

        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_FALLBACK);
            })
        );
    }
);
// ======================================
// MESSAGE HANDLER
// Allows app to ask service worker version
// ======================================

self.addEventListener(
    "message",
    event => {
        if(!event.data){
            return;
        }

        if(event.data.type === "GET_VERSION"){
            event.source.postMessage({
                type: "SERVICE_WORKER_VERSION",
                version: APP_VERSION,
                coreCache: CORE_CACHE,
                documentCache: DOCUMENT_CACHE
            });
        }

        if(event.data.type === "SKIP_WAITING"){
            self.skipWaiting();
        }
    }
);
