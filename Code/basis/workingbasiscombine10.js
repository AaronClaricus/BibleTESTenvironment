	// ======================================
	// BEGIN EVENTS LISTENERS
	// ======================================
// ==============================
// LAYOUT MODE BUTTON
// cycles:
// 4 panel -> 3 panel -> 2 panel -> 1 panel
// ==============================
const toggleButton =
    document.getElementById("layoutToggle");
// ======================================
// CLICK ROUTER
// ======================================
function setupClickRouter(){
	document.addEventListener("click", e => {
		// ==============================
		// NAV TREE TOGGLE
		// ==============================
		const toggle =
			e.target.closest(".toggle");
		if(toggle){
			const nested =
				toggle.parentElement.querySelector(
					":scope > .nested"
				);
			if(!nested){
				return;
			}
			if(
				nested.classList.contains("open")
			){
				nested.classList.remove("open");
				toggle.textContent =
					toggle.textContent.replace(
						"▼",
						"▶"
					);
			}
			else{
				nested.classList.add("open");
				toggle.textContent =
					toggle.textContent.replace(
						"▶",
						"▼"
					);
			}
			return;
		}
		// ==============================
		// FILE LINKS
		// ==============================
		const fileLink =
			e.target.closest(".file-link");
		if(fileLink){
			const frame =
				document.getElementById(
					fileLink.dataset.frame
				);
			if(!frame){
				return;
			}
			frame.src =
				fileLink.dataset.file +
				".html";
			loadTextFile(
				fileLink.dataset.frame,
				fileLink.dataset.file
			);
			return;
		}
	});
}	
// ==============================
// RELOAD ALL OPEN FRAMES
// ==============================
function reloadAllOpenFrames(){
	FRAMES.forEach(frame => {
		const frameId =
			frame[0];
		const file =
			APP.state.currentFiles[
				frameId
			];
		if(file){
			loadTextFile(
				frameId,
				file
			);
		}
	});
}
// ==========================================
// Visibility Toggle
// ==========================================
function setupVisibilityToggle(
	button,
	bodyClass,
	storageKey,
	showText,
	hideText
){
	if(!button){
		return;
	}
	const hidden =
		AppStorage.get(
			storageKey,
			false
		);
	if(hidden){
		document.body.classList.add(
			bodyClass
		);
		button.textContent =
			showText;
	}
	else{
		button.textContent =
			hideText;
	}
	button.addEventListener(
		"click",
		() => {
			document.body.classList.toggle(
				bodyClass
			);
			const hidden =
				document.body.classList.contains(
					bodyClass
				);
			button.textContent =
				hidden
					? showText
					: hideText;
			AppStorage.set(
				storageKey,
				hidden
			);
		}
	);
}
// ==========================================
// FILE LINKS
// ==========================================
function getLayoutMode(){
	return APP.state.layoutMode;
}
function setLayoutMode(mode){
	APP.state.layoutMode = mode;
}
function setupLayoutToggle(){
	toggleButton.addEventListener(
		"click",
		() => {
			const nextMode =
				APP.state.layoutMode === 4 ? 3 :
				APP.state.layoutMode === 3 ? 2 :
				APP.state.layoutMode === 2 ? 1 :
				4;
			setLayoutMode(
				nextMode
			);
			AppStorage.set(
				LAYOUT_MODE_KEY,
				nextMode
			);
			applyLayoutMode();
		}
	);
}
	// ======================================
	// END EVENTS LISTENERS
	// ======================================
	// ======================================
	// BEGIN ASYNC FUNCTIONS
	// ======================================
// ==============================
// LOAD TEMPLATE ONCE
// ==============================
async function initTemplate(){

    if(APP.state.templateHTML){
        return;
    }

    const response =
        await fetch(
            "./Code/template.html"
        );

    APP.state.templateHTML =
        await response.text();
}
// ==============================
// fetch text file
// ==============================
async function fetchTextFile(file) {
    // ==========================
    // RETURN CACHED VERSION
    // ==========================
    if (APP.state.fileCache[file]) {
        console.log(
            "[CACHE HIT]",
            file
        );
        return APP.state.fileCache[file];
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
	APP.state.fileCache[file] = text;
	// remember order
	APP.state.cacheOrder.push(file)
	// remove oldest cache entry
	if (
		APP.state.cacheOrder.length >
		CONFIG.cache.maxFiles
	) {
		const oldest =
		APP.state.cacheOrder.shift();

		delete APP.state.fileCache[oldest];

		console.log("[CACHE REMOVED]", oldest);
	}
    return text;
}
// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(frameId, file) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;

    try {
        // 1. register state + persist last opened
        StateService.setCurrentFile(frameId, file);

        // 2. ensure template exists
        await TemplateService.ensure();

        // 3. get file content (cached/fetched)
        const text = await FileService.get(file);

        // 4. resolve highlight scheme
        const scheme = UIService.getHighlightScheme();

        // 5. render into iframe
        FrameService.render(iframe, text, scheme);

    } catch (err) {
        FrameService.renderError(iframe, err);
    }
}
	// ======================================
	// END ASYNC FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL FUNCTIONS
	// ======================================
function restoreFontSize(){
    const size = AppStorage.get(
        FONT_SIZE_KEY,
        "12px"
    );

    document.documentElement.style.setProperty(
        "--font-size",
        size
    );

    if(fontSelector){
        fontSelector.value = size;
    }
}
function restoreHighlightScheme(){
	const saved =
		AppStorage.get(
			HIGHLIGHT_KEY,
			null
		);
	if(
		!saved ||
		!highlightSelector
	){
		return;
	}
	highlightSelector.value =
		saved;
}
// ==============================
// BUILD HTML
// ==============================
function buildTextHTML(text, scheme){
    const size =
        getComputedStyle(document.documentElement)
            .getPropertyValue("--font-size");
    const content =
        text && text.trim()
            ? escapeHTML(text)
            : `
                <div style="
                    border:2px dashed #666;
                    padding:1em;
                    color:#aaa;
                ">
                    EMPTY FRAME
                </div>
            `;
    return APP.state.templateHTML
        .replaceAll("__FONT_SIZE__", size)
        .replaceAll("__HIGHLIGHT_BG__", scheme.bg)
        .replaceAll("__HIGHLIGHT_TEXT__", scheme.text)
        .replace("__CONTENT__", content);
}
// ==============================
// HTML ESCAPE
// ==============================
function escapeHTML(str){
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
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
// DO NOT MODIFY ABOVE UNTIL WORKING

// ==============================
// LOAD SCROLL STORE
// ==============================
function loadScrollStore(){
	return AppStorage.scroll.load();
}
// ==============================
// SAVE SCROLL STORE
// ==============================
function saveScrollStore(store){
	AppStorage.scroll.save(store);
}
// ==============================
// SAVE LAST OPENED FILE
// ==============================
function saveLastOpenedFile(
	frameId,
	file
){
	AppStorage.lastOpened.setFile(
		frameId,
		file
	);
}
// ==============================
// LOAD LAST OPENED FILES
// ==============================
function loadLastOpenedFiles(){
	return AppStorage.lastOpened.load();
}
// ==============================
// RESTORE SCROLL Position 
// ==============================
function restoreScrollPosition(frameId, iframe) {
    const file = APP.state.currentFiles[frameId];
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

		iframeWindow.scrollTo(
			0,
			scrollY
		);

		console.log(
			"[RESTORED]",
			frameId,
			file,
			scrollY
		);

	},
	CONFIG.scroll.restoreDelay);
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
			APP.state.currentFiles[frameId];
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
									CONFIG.scroll.maxHistory
								)
							);
					}
					// ==============================
					// SAVE STORE
					// ==============================
					saveScrollStore(store);
				}, CONFIG.scroll.debounce);
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
// UPDATE IFRAME TITLE
// ==============================
function updateIframeTitle(
    frameId,
    filePath
){

    const titleBar =
        document.getElementById(
            FRAME_TITLES[frameId]
        );

    if(!titleBar){
        return;
    }

    if(!filePath){
        titleBar.textContent =
            "No File";
        return;
    }

    const fileName =
        filePath.split("/").pop();

    titleBar.textContent =
        fileName;
}
// ==============================
// UPDATE IFRAME FONT SIZE
// ==============================


// ==============================
// APPLY LAYOUT
// ==============================
function applyLayoutMode(){
	const layoutMode =
        APP.state.layoutMode;
    document.body.classList.remove(
        "four-panel",
        "three-panel",
        "two-panel",
        "one-panel"
    );
    if(APP.state.layoutMode === 4){
        document.body.classList.add(
            "four-panel"
        );
        toggleButton.textContent =
            "Switch to 3 Panel Mode";
    }
    else if(APP.state.layoutMode === 3){
        document.body.classList.add(
            "three-panel"
        );
        toggleButton.textContent =
            "Switch to 2 Panel Mode";
    }
    else if(APP.state.layoutMode === 2){
        document.body.classList.add(
            "two-panel"
        );
        toggleButton.textContent =
            "Switch to 1 Panel Mode";
    }
    else{
        document.body.classList.add(
            "one-panel"
        );
        toggleButton.textContent =
            "Switch to 4 Panel Mode";
    }
}
// ======================================
// GENERIC SEARCH FUNCTION
// ======================================
function setupIframeSearch(
    inputId,
    buttonId,
    iframeId,
    counterId
){
    const input =
        document.getElementById(inputId);
    const button =
        document.getElementById(buttonId);
    const iframe =
        document.getElementById(iframeId);
    const counter =
        document.getElementById(counterId);
    APP.state.searchState[iframeId] = {
        matches: [],
        index: -1,
        lastTerm: ""
    };
    function updateCounter(){
        const state =
            APP.state.searchState[iframeId];
        if(state.matches.length === 0){
            counter.textContent =
                "0/0";
            return;
        }
        counter.textContent =
            (state.index + 1) +
            "/" +
            state.matches.length;
    }
    function searchIframe(){
        const term =
            input.value.trim();
        if(!term){
            return;
        }
        const state =
            APP.state.searchState[iframeId];
        const doc =
            iframe.contentDocument ||
            iframe.contentWindow.document;
        // ==========================
        // NEW SEARCH
        // ==========================
        if(state.lastTerm !== term){
            state.lastTerm = term;
            removeHighlights(doc);
            let escaped =
                term.replace(
                    /[.*?^${}()|[\]\\]/g,
                    "\\$&"
                );
            escaped =
                escaped.replace(
                    /\+/g,
                    ":"
                );
            const regex =
                new RegExp(
                    escaped,
                    "gi"
                );
            highlightText(
                doc.body,
                regex,
                doc
            );
            state.matches =
                [...doc.querySelectorAll("mark")];
            state.index = -1;
        }
        if(state.matches.length === 0){
            updateCounter();
            return;
        }
        // ==========================
        // NEXT MATCH
        // ==========================
        state.index++;
        if(
            state.index >=
            state.matches.length
        ){
            state.index = 0;
        }
        const match =
            state.matches[state.index];
const win =
    iframe.contentWindow;
const rect =
    match.getBoundingClientRect();
	win.scrollTo({
		top:
			win.scrollY +
			rect.top -
			CONFIG.search.scrollOffset,
		behavior:"auto"
	});
        updateCounter();
    }
    button.addEventListener(
        "click",
        searchIframe
    );
    input.addEventListener(
        "keydown",
        event => {
            if(event.key === "Enter"){
                searchIframe();
            }
        }
    );
}
// ======================================
// REMOVE OLD HIGHLIGHTS
// ======================================
function removeHighlights(doc){
    const marks =
        doc.querySelectorAll("mark");
    marks.forEach(mark => {
        const parent =
            mark.parentNode;
        parent.replaceChild(
            doc.createTextNode(
                mark.textContent
            ),
            mark
        );
        parent.normalize();
    });
}
// ======================================
// HIGHLIGHT TEXT
// ======================================
function highlightText(node, regex, doc){
    // TEXT NODE
    if(node.nodeType === 3){
        const text =
            node.textContent;
        if(regex.test(text)){
            const span =
                doc.createElement("span");
            span.innerHTML =
                text.replace(
                    regex,
                    match =>
                        `<mark>${match}</mark>`
                );
            node.parentNode.replaceChild(
                span,
                node
            );
        }
        return;
    }
    // ELEMENT NODE
    if(node.nodeType === 1){
        const tag =
            node.tagName;
        if(
            tag === "SCRIPT" ||
            tag === "STYLE"  ||
            tag === "MARK"
        ){
            return;
        }
        [...node.childNodes].forEach(
            child =>
                highlightText(
                    child,
                    regex,
                    doc
                )
        );
    }
}
// ==============================
// Restore layout mode
// ==============================
function restoreLayoutMode(){
    APP.state.layoutMode =
        AppStorage.get(
            LAYOUT_MODE_KEY,
            4
        );
}
// ==============================
// DEFAULT LOADS
// ==============================
function loadtheTextFiles(){
	FRAMES.forEach(frame => {
		const frameId =
			frame[0];
		loadTextFile(
			frameId,
			APP.state.lastOpened[frameId] ||
			DEFAULT_FILES[frameId]
		);
	});
}
// ======================================
// INITIALIZE ALL 4 SEARCHES
// ======================================
function exeIframeSearch(){
	setupIframeSearch(
		"search",
		"go",
		"frameB",
		"countB"
	);

	setupIframeSearch(
		"searchC",
		"goC",
		"frameC",
		"countC"
	);

	setupIframeSearch(
		"searchD",
		"goD",
		"frameD",
		"countD"
	);

	setupIframeSearch(
		"searchE",
		"goE",
		"frameE",
		"countE"
	);
}
// ======================================
// END GENERAL FUNCTIONS
// ======================================
function restoreAppState(){
	APP.state.lastOpened =
		loadLastOpenedFiles();
	APP.state.settings.fontSize =
		AppStorage.get(
			FONT_SIZE_KEY,
			"12px"
		);
	restoreLayoutMode();
	restoreFontSize();
	restoreHighlightScheme();
}
	// ======================================
	// END GENERAL FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL EXECUTION
	// ======================================
document.addEventListener("DOMContentLoaded", init);
function init() {
    console.log("APP INIT");
	Object.assign(

		APP.state.lastOpened,

		loadLastOpenedFiles()

	);
	restoreAppState()
	applyLayoutMode();
	setupNavControlsToggle();
	setupVisibilityToggle(
		toggleSearch,
		"hide-search",
		SEARCH_KEY,
		"Show Search",
		"Hide Search"
	);
	setupVisibilityToggle(
		toggleGo,
		"hide-go",
		GO_KEY,
		"Show Go",
		"Hide Go"
	);
    setupLayoutToggle();
	buildNavNew();
	setupClickRouter();
    loadtheTextFiles ();
	exeIframeSearch()
}
// ==============================
// SAVE HIGHLIGHT SELECTION
// ==============================
if(highlightSelector){
    highlightSelector.addEventListener(
        "change",
        function(){
			AppStorage.set(
				HIGHLIGHT_KEY,
				this.value
			);
            // reload all frames
			reloadAllOpenFrames();
        }
    );
}
// ==============================
// APPLY TO ALL FRAMES
// ==============================
FRAMES.forEach(frame => {
	attachScrollTracking(
		frame[0]
	);
});
// ==============================
// FONT SYSTEM
// ==============================
function setFontSize(size){
	APP.state.settings.fontSize = size;
	document.documentElement.style.setProperty(
		"--font-size",
		size
	);
	AppStorage.set(
		FONT_SIZE_KEY,
		size
	);
	if(fontSelector){
		fontSelector.value = size;
	}
}
// ==============================
// FONT SELECTOR CHANGE
// ==============================
if(fontSelector){
	fontSelector.addEventListener(
		"change",
		function(){
			setFontSize(
				this.value
			);
			reloadAllOpenFrames();
		}
	);
}
// apply immediately
	// ======================================
	// END GENERAL EXECUTION
	// ======================================
