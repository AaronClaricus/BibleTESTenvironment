// rev 7 code block
// ==============================
// TRACKING STORAGE
// ==============================
const currentFiles = {};
const savedScrollPositions = {};




// rev 7 code block


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
    "./Gospel/John"
);
loadTextFile(
    "frameD",
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
    const response = await fetch(file);
    return await response.text();
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
// IFRAME LOAD
// ==============================
function attachIframeLoadHandler(iframe, frameId, file) {
    iframe.addEventListener(
        "load",
        () => {
            updateIframeTitle(frameId, file);
        },
        { once: true }
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
		attachIframeLoadHandler(iframe, frameId, file);
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
// rev 8 drop in

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
	const scrollY = Number(localStorage.getItem("scroll:" + file));
	if (isNaN(scrollY))
	// rev 13 drop in
    if (typeof scrollY !== "number") {
        console.log("[RESTORE SKIPPED] No saved position for", file);
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
// rev 8 drop in



// ==============================
// ATTACH SCROLL TRACKER TO ANY FRAME
// ==============================
function attachScrollTracking(frameId) {

    const iframe =
        document.getElementById(frameId);

    if (!iframe) return;

    iframe.addEventListener("load", () => {

        console.log(frameId + " LOADED");

        const iframeWindow =
            iframe.contentWindow;

        iframeWindow.onscroll = () => {

            console.log(
                frameId + " SCROLL:",
                iframeWindow.scrollY
            );

            const currentFile =
                currentFiles[frameId];

            if (!currentFile) {
                console.log(
                    frameId + ": NO CURRENT FILE"
                );
                return;
            }
			// rev 9 and 10 drop in
			// rev 13 drop in
			localStorage.setItem(
				"scroll:" + currentFile,
				iframeWindow.scrollY
			);
			// rev 13 drop in
			console.log(
				"SAVED:",
				currentFile,
				savedScrollPositions[currentFile]
			);

			const scrollY = savedScrollPositions[currentFile];
			// rev 9 drop in
            console.log(
                "SAVED:",
                currentFile,
                savedScrollPositions[currentFile]
            );
        };
        // rev 8 drop in
        
        restoreScrollPosition(frameId, iframe);
        
		// rev 8 drop in
    });
}

// ==============================
// APPLY TO ALL FRAMES
// ==============================
["frameB", "frameC", "frameD"]
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
