// ======================================
// SERVICE WORKER
// PHASE 27B
// ======================================

const CORE_CACHE =
    "bible-repository-core-test-v6";
    
    const DOCUMENT_CACHE =
    "bible-repository-documents-v2";
    
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

self.addEventListener(
    "activate",
    event => {
        const allowedCaches = [
            CORE_CACHE,
            DOCUMENT_CACHE
        ];

        event.waitUntil(
            caches
                .keys()
                .then(keys => {
                    return Promise.all(
                        keys
                            .filter(key => !allowedCaches.includes(key))
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
