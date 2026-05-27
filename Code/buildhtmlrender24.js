
// ==============================
// TRACKING STORAGE
// ==============================
const currentFiles = {};
const savedScrollPositions = {};
// ==============================
// FILE CACHE
// ==============================
const fileCache = {};
// max cached files
const MAX_CACHE = 500;
// tracks cache order
const cacheOrder = [];
// ==============================
// SCROLL STATE STORAGE
// ==============================
const SCROLL_STORE_KEY =
    "scroll-state";
// ==============================
// LAST OPENED FILE STORAGE
// ==============================
const LAST_OPENED_KEY =
    "last-opened-files";
// max saved files PER FRAME
const MAX_SCROLL_HISTORY = 500;
window.addEventListener("load", () => {
    console.log("SCRIPT LOADED");
    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(link => {
        link.addEventListener("click", () => {
            loadTextFile(
                link.dataset.frame,
                link.dataset.file
            );
        });
    });
});
// ==============================
// DEFAULT LOADS
// ==============================
const lastOpened =
    loadLastOpenedFiles();

loadTextFile(
    "frameB",
    lastOpened.frameB ||
    "./General Sources/Introduction"
);

loadTextFile(
    "frameC",
    lastOpened.frameC ||
    "./WEB/Gospel/John"
);

loadTextFile(
    "frameD",
    lastOpened.frameD ||
    "./WEB/Prophets/Revelation"
);

loadTextFile(
    "frameE",
    lastOpened.frameE ||
    "./General Sources/Resources"
);
// ==============================
// HIGHLIGHT SCHEME
// ==============================
function getHighlightScheme(highlightSchemes) {
    const selected =
        document.getElementById("highlightSelector")?.value;
    const scheme =
        (highlightSchemes && highlightSchemes[selected]) || {
            bg: "#000",
            text: "#fff"
        };
    return scheme;
}
// ==============================
// fetch text file
// ==============================
async function fetchTextFile(file) {
    // ==========================
    // RETURN CACHED VERSION
    // ==========================
    if (fileCache[file]) {
        console.log(
            "[CACHE HIT]",
            file
        );
        return fileCache[file];
    }
    // ==========================
    // FETCH FILE
    // ==========================
    console.log(
        "[FETCH]",
        file
    );
    const response =
        await fetch(file);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${file}`
        );
    }
    const text =
        await response.text();
	// ==============================
	// CACHE FILE
	// ==============================
	fileCache[file] = text;
	// remember order
	cacheOrder.push(file);
	// remove oldest cache entry
	if (cacheOrder.length > MAX_CACHE) {
		const oldest =
			cacheOrder.shift();
		delete fileCache[oldest];
		console.log(
			"[CACHE REMOVED]",
			oldest
		);
	}
    return text;
}
// ==============================
// LOAD CONTENT
// ==============================
function setIframeContent(iframe, text, scheme) {
    iframe.srcdoc = buildTextHTML(text, scheme);
}
// ==============================
// Handle Iframe Error
// ==============================
function handleIframeError(err, iframe) {
    console.error(err);
    iframe.srcdoc = buildTextHTML(
        "ERROR",
        {
            bg: "#400",
            text: "#fff"
        }
    );
}
// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;
    currentFiles[frameId] = file;
    saveLastOpenedFile(
		frameId,
		file
	);
    try {
        await initTemplate();
		const text = await fetchTextFile(file);
		const scheme = getHighlightScheme(highlightSchemes);
		setIframeContent(iframe, text, scheme);
    } catch (err) {
    handleIframeError(err, iframe);
	}
}
// DO NOT MODIFY ABOVE UNTIL WORKING
//rev 9 drop in
function normalizeFileKey(file) {
    return file.replace(/^\.\//, "");
}
//rev 9 drop in
// ==============================
// LOAD SCROLL STORE
// ==============================
function loadScrollStore() {

    try {

        return JSON.parse(
            localStorage.getItem(
                SCROLL_STORE_KEY
            )
        ) || {};

    } catch {

        return {};
    }
}

// ==============================
// SAVE SCROLL STORE
// ==============================
function saveScrollStore(store) {

    localStorage.setItem(
        SCROLL_STORE_KEY,
        JSON.stringify(store)
    );
}
// ==============================
// SAVE LAST OPENED FILE
// ==============================
function saveLastOpenedFile(
    frameId,
    file
) {

    let store;

    try {

        store =
            JSON.parse(
                localStorage.getItem(
                    LAST_OPENED_KEY
                )
            ) || {};

    } catch {

        store = {};
    }

    store[frameId] = file;

    localStorage.setItem(
        LAST_OPENED_KEY,
        JSON.stringify(store)
    );
}

// ==============================
// LOAD LAST OPENED FILES
// ==============================
function loadLastOpenedFiles() {

    try {

        return JSON.parse(
            localStorage.getItem(
                LAST_OPENED_KEY
            )
        ) || {};

    } catch {

        return {};
    }
}
// ==============================
// RESTORE SCROLL Position 
// ==============================
function restoreScrollPosition(frameId, iframe) {
    const file = currentFiles[frameId];
    if (!file) {
        console.log("[RESTORE BLOCKED] No file for", frameId);
        return;
    }
	// rev 13 drop in
	// ==============================
	// LOAD STORE
	// ==============================
	const store =
		loadScrollStore();

	const entry =
		store?.[frameId]?.[file];

	if (!entry) {

		console.log(
			"[RESTORE SKIPPED]",
			file
		);

		return;
	}

	const scrollY =
		Number(entry.y);

	if (isNaN(scrollY)) {

		console.log(
			"[RESTORE FAILED]",
			file
		);

		return;
	}
    const iframeWindow = iframe.contentWindow;
    // ensure layout is ready
    setTimeout(() => {
        iframeWindow.scrollTo(0, scrollY);

        console.log(
            "[RESTORED]",
            frameId,
            file,
            scrollY
        );
    }, 0);
}
// ==============================
// ATTACH SCROLL TRACKER TO ANY FRAME
// ==============================
function attachScrollTracking(frameId) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe) return;
    // ONE persistent load handler
    	iframe.onload = () => {
		console.log(
			frameId + " LOADED"
		);
		const iframeWindow =
			iframe.contentWindow;
		// current file for this frame
		const file =
			currentFiles[frameId];
		let scrollTimeout;
		// ONE scroll handler
		iframeWindow.onscroll = () => {
			clearTimeout(
				scrollTimeout
			);
			scrollTimeout =
				setTimeout(() => {
					if (!file)
						return;
					// ==============================
					// LOAD STORE
					// ==============================
					const store =
						loadScrollStore();

					// ensure frame exists
					if (!store[frameId]) {

						store[frameId] = {};
					}

					// ==============================
					// SAVE POSITION
					// ==============================
					store[frameId][file] = {

						y: iframeWindow.scrollY,
						time: Date.now()
					};

					// ==============================
					// LIMIT HISTORY
					// keep newest 500
					// ==============================
					const entries =
						Object.entries(store[frameId]);

					if (entries.length > MAX_SCROLL_HISTORY) {

						entries.sort(
							(a, b) =>
								b[1].time - a[1].time
						);

						store[frameId] =
							Object.fromEntries(
								entries.slice(
									0,
									MAX_SCROLL_HISTORY
								)
							);
					}

					// ==============================
					// SAVE STORE
					// ==============================
					saveScrollStore(store);
				}, 100);
		};
		// restore scroll
		restoreScrollPosition(
			frameId,
			iframe
		);
		// update title
		updateIframeTitle(
			frameId,
			file
		);
	};
}
// ==============================
// APPLY TO ALL FRAMES
// ==============================
["frameB", "frameC", "frameD","frameE"]
    .forEach(attachScrollTracking);
// ==============================
// SCROLL SAVE FUNCTION
// ==============================
function saveScrollPosition(frameId, scrollY) {
    const file =
        currentFiles[frameId];
    console.log(
        "[SCROLL SAVE TRIGGERED]",
        "frame:",
        frameId,
        "file:",
        file,
        "scrollY:",
        scrollY
    );
    if (!file) {
        console.log(
            "[SCROLL SAVE BLOCKED] No file for",
            frameId
        );
        return;
    }
    savedScrollPositions[file] =
        scrollY;
    console.log(
        "[SCROLL SAVED]",
        file,
        "=>",
        savedScrollPositions[file]
    );
}
