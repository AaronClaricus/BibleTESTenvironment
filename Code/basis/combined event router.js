
	// ======================================
	// BEGIN EVENTS LISTENERS
	// ======================================
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
	
	
// ==========================================
// INIT
// ==========================================
function buildNavNew(){
	buildNavigation("navA", NAVIGATION);
}

	
// ======================================
// TOGGLE NAV CONTROLS
// ======================================
// ==============================
// LAST OPENED FILE STORAGE
// ==============================


function setupNavControlsToggle(){
	const toggleControls =
		document.getElementById(
			"toggleControls"
		);

	const navControls =
		document.querySelector(
			".nav-controls"
		);

	if(
		!toggleControls ||
		!navControls
	){
		return;
	}

	// ==========================
	// RESTORE SAVED STATE
	// ==========================
	const hidden =
		localStorage.getItem(
			CONTROLS_KEY
		) === "true";

	if(hidden){
		navControls.style.display =
			"none";

		toggleControls.textContent =
			"Show Controls";
	}

	// ==========================
	// TOGGLE
	// ==========================
	toggleControls.addEventListener(
		"click",
		() => {

			const isHidden =
				navControls.style.display ===
				"none";

			if(isHidden){

				navControls.style.display =
					"flex";

				toggleControls.textContent =
					"Hide Controls";

				localStorage.setItem(
					CONTROLS_KEY,
					"false"
				);

			}else{

				navControls.style.display =
					"none";

				toggleControls.textContent =
					"Show Controls";

				localStorage.setItem(
					CONTROLS_KEY,
					"true"
				);
			}
		}
	);
		
}


// ======================================
// TOGGLE SEARCH VISIBILITY
// ======================================

function setupSearchToggle(){
	toggleSearch?.addEventListener(
		"click",
		() => {

			document.body.classList.toggle(
				"hide-search"
			);

			// BUTTON TEXT
			if(
				document.body.classList.contains(
					"hide-search"
				)
			){
				toggleSearch.textContent =
					"Show Search";
			}
			else{
				toggleSearch.textContent =
					"Hide Search";
			}
		}
	);
}
function setupGoToggle(){
	toggleGo?.addEventListener("click", () => {

		document.body.classList.toggle("hide-go");

		if(document.body.classList.contains("hide-go")){
			toggleGo.textContent = "Show Go";
		} else {
			toggleGo.textContent = "Hide Go";
		}
	});
}



// ==========================================
// FILE LINKS
// ==========================================


function setupLayoutToggle(){
	toggleButton.addEventListener("click", function () {

		// ======================
		// REMOVE ALL MODES
		// ======================
		document.body.classList.remove(
			"four-panel",
			"three-panel",
			"two-panel",
			"one-panel"
		);

		// ======================
		// CYCLE MODES
		// ======================
		if (layoutMode === 4) {

			layoutMode = 3;
			
			localStorage.setItem(
				LAYOUT_MODE_KEY,
				layoutMode
			);

			document.body.classList.add("three-panel");

			toggleButton.textContent =
				"Switch to 2 Panel Mode";

		}
		else if (layoutMode === 3) {

			layoutMode = 2;

			localStorage.setItem(
				LAYOUT_MODE_KEY,
				layoutMode
			);

			document.body.classList.add("two-panel");

			toggleButton.textContent =
				"Switch to 1 Panel Mode";

		}
		else if (layoutMode === 2) {

			layoutMode = 1;

			localStorage.setItem(
				LAYOUT_MODE_KEY,
				layoutMode
			);

		
			document.body.classList.add("one-panel");

			toggleButton.textContent =
				"Switch to 4 Panel Mode";

		}
		else {

			layoutMode = 4;

			localStorage.setItem(
				LAYOUT_MODE_KEY,
				layoutMode
			);

			document.body.classList.add("four-panel");

			toggleButton.textContent =
				"Switch to 3 Panel Mode";

		}

	});
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
    if(TEMPLATE_HTML) return;
    const response =
        await fetch("./Code/template.html");
    TEMPLATE_HTML =
        await response.text();
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
	// ======================================
	// END ASYNC FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL FUNCTIONS
	// ======================================
	
function restoreHighlightScheme(){
    const saved = localStorage.getItem(HIGHLIGHT_KEY);
    if(!saved || !highlightSelector) return;

    highlightSelector.value = saved;
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
    return TEMPLATE_HTML
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
function normalizeFileKey(file) {
    return file.replace(/^\.\//, "");
}
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
// ==============================
// UPDATE IFRAME TITLE
// ==============================
function updateIframeTitle(frameId, filePath){
    const titleMap = {
        frameB: "titleB",
        frameC: "titleC",
        frameD: "titleD",
        frameE: "titleE"
    };
    const titleBar =
        document.getElementById(titleMap[frameId]);
    if(!titleBar) return;
    const fileName =
        filePath.split("/").pop();
    titleBar.textContent =
        fileName;
}
// ==============================
// UPDATE IFRAME FONT SIZE
// ==============================
function updateIframeFonts(){
    ["frameB","frameC","frameD","frameE"].forEach(function(id){
        const iframe = document.getElementById(id);
        try{
            const doc = iframe.contentDocument ||
                        iframe.contentWindow.document;
            if(doc && doc.body){
                doc.body.style.fontSize =
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--font-size");
            }
        } catch(e){}
    });
}
// ==========================================
// SIMPLE TREE FORMAT
// ==========================================
// ==========================================
// RECURSIVE BUILDER
// ==========================================
function createTree(node){
    const li = document.createElement("li");
    // ======================================
    // BOOK
    // ["Matthew", "./Gospel/Matthew"]
    // ======================================
    if(typeof node[1] === "string"){
        const button = document.createElement("button");
        button.className = "toggle";
        button.textContent = "▶ " + node[0];
        li.appendChild(button);
        const nested = document.createElement("ul");
        nested.className = "nested";
		FRAMES.forEach(frame => {
			const frameLi =
				document.createElement("li");
			// ==============================
			// CENTER PANEL ITEMS
			// ==============================
			if(frame[0] === "frameC"){
				frameLi.classList.add(
					"center-item"
				);
			}
			// ==============================
			// RIGHT PANEL ITEMS
			// ==============================
			if(frame[0] === "frameD"){
				frameLi.classList.add(
					"center-item2"
				);
			}
			// ==============================
			// FAR RIGHT PANEL ITEMS
			// ==============================
			if(frame[0] === "frameE"){
				frameLi.classList.add(
					"center-item3"
				);
			}
			const link =
				document.createElement("button");
				link.type = "button";
			link.className = "file-link";
			link.dataset.frame = frame[0];
			link.dataset.file = node[1];
			link.textContent =
				frame[1] + " : " + node[0];
			frameLi.appendChild(link);
			nested.appendChild(frameLi);
		});
        li.appendChild(nested);
        return li;
    }
    // ======================================
    // CATEGORY
    // ["Gospel", [...], [...]]
    // ======================================
    const button = document.createElement("button");
    button.className = "toggle";
    button.textContent = "▶ " + node[0];
    li.appendChild(button);
    const nested = document.createElement("ul");
    nested.className = "nested";
    for(let i = 1; i < node.length; i++){
        nested.appendChild(
            createTree(node[i])
        );
    }
    li.appendChild(nested);
    return li;
}
// ==========================================
// BUILD NAV
// ==========================================
function buildNavigation(containerId, data){
    const container =
        document.getElementById(containerId);
    const ul = document.createElement("ul");
    data.forEach(node => {
        ul.appendChild(
            createTree(node)
        );
    });
    container.appendChild(ul);
}
// ==============================
// APPLY LAYOUT
// ==============================
function applyLayoutMode(){
    document.body.classList.remove(
        "four-panel",
        "three-panel",
        "two-panel",
        "one-panel"
    );
    if(layoutMode === 4){
        document.body.classList.add(
            "four-panel"
        );
        toggleButton.textContent =
            "Switch to 3 Panel Mode";
    }
    else if(layoutMode === 3){
        document.body.classList.add(
            "three-panel"
        );
        toggleButton.textContent =
            "Switch to 2 Panel Mode";
    }
    else if(layoutMode === 2){
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
    searchState[iframeId] = {
        matches: [],
        index: -1,
        lastTerm: ""
    };
    function updateCounter(){
        const state =
            searchState[iframeId];
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
            searchState[iframeId];
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
        100,
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
// DEFAULT LOADS
// ==============================
function loadtheTextFiles () {
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
	// ======================================
	// BEGIN GENERAL EXECUTION
	// ======================================
document.addEventListener("DOMContentLoaded", init);
function init() {

    console.log("APP INIT");
	
	lastOpened = loadLastOpenedFiles();
	setupNavControlsToggle();
	setupSearchToggle();
	setupGoToggle();
	
    setupLayoutToggle();
	restoreHighlightScheme();
	buildNavNew();
	setupClickRouter();
    loadtheTextFiles ();
    applyLayoutMode();
	exeIframeSearch()
}
// ==============================
// SAVE HIGHLIGHT SELECTION
// ==============================
if(highlightSelector){
    highlightSelector.addEventListener(
        "change",
        function(){
            localStorage.setItem(
                HIGHLIGHT_KEY,
                this.value
            );
            // reload all frames
            ["frameB","frameC","frameD","frameE"]
                .forEach(frameId => {
                    const file =
                        currentFiles[frameId];
                    if(file){
                        loadTextFile(
                            frameId,
                            file
                        );
                    }
                });
        }
    );
}

// ==============================
// APPLY TO ALL FRAMES
// ==============================
["frameB", "frameC", "frameD","frameE"]
    .forEach(attachScrollTracking);
// ==============================
// RESTORE SAVED FONT SIZE
// ==============================
if(savedFontSize){
	document.documentElement
		.style.setProperty(
			"--font-size",
			savedFontSize
		);
	if(fontSelector){
		fontSelector.value =
			savedFontSize;
	}
}
// ==============================
// FONT SELECTOR CHANGE
// ==============================
if(fontSelector){
	fontSelector.addEventListener(
		"change",
		function(){
			document.documentElement
				.style.setProperty(
					"--font-size",
					this.value
				);
			// save font
			localStorage.setItem(
				FONT_SIZE_KEY,
				this.value
			);
			updateIframeFonts();
		}
	);
}
// apply immediately
	// ======================================
	// END GENERAL EXECUTION
	// ======================================
