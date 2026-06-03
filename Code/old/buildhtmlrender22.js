
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
const MAX_CACHE = 50;
// tracks cache order
const cacheOrder = [];
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
loadTextFile(
    "frameB",
    "./General Sources/Introduction"
);
loadTextFile(
    "frameC",
    "./WEB/Gospel/WEB John"
);
loadTextFile(
    "frameD",
    "./WEB/Prophets/Revelation"
);
loadTextFile(
    "frameE",
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
// RESTORE SCROLL Position 
// ==============================
function restoreScrollPosition(frameId, iframe) {
    const file = currentFiles[frameId];
    if (!file) {
        console.log("[RESTORE BLOCKED] No file for", frameId);
        return;
    }
	// rev 13 drop in
	const key =
		`scroll:${frameId}:${file}`;
	const scrollY =
		Number(localStorage.getItem(key));
	if (isNaN(scrollY)) {
		console.log(
			"[RESTORE SKIPPED] No saved position for",
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
					const key =
						`scroll:${frameId}:${file}`;
					localStorage.setItem(
						key,
						iframeWindow.scrollY
					);
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
