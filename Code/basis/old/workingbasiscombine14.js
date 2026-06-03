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
			StateService.getCurrentFile(frameId);
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
function setupVisibilityToggle(button, bodyClass, stateKey, showText, hideText){
    if(!button) return;

    const value = UIState.get(stateKey);

    document.body.classList.toggle(bodyClass, value);

    button.textContent = value ? showText : hideText;

    button.addEventListener("click", () => {
        const newValue = !UIState.get(stateKey);
        UIState.set(stateKey, newValue);

        button.textContent = newValue ? showText : hideText;
    });
}
// ==========================================
// FILE LINKS
// ==========================================
function getLayoutMode(){
    return UIState.get("layoutMode");
}

function setLayoutMode(mode){
    UIState.set("layoutMode", mode);
}
function setupLayoutToggle(){

    toggleButton.addEventListener(
        "click",
        () => {

            const current =
                UIState.get(
                    "layoutMode"
                );

            const nextMode =
                current === 4 ? 3 :
                current === 3 ? 2 :
                current === 2 ? 1 : 4;

            UIState.set(
                "layoutMode",
                nextMode
            );
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

// ==============================
// fetch text file
// ==============================

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
       const scheme =
		UIService.getHighlightScheme(
			UIState.get(
				"highlightScheme"
			)
		);
        // 5. render into iframe
        const text1 = await FileService.get(file);
console.log("[FILE CONTENT SAMPLE]", text1?.slice?.(0, 50));
        FrameService.render(iframe, text1, scheme);
console.log("[loadTextFile]", { frameId, file });
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

// ==============================
// BUILD HTML
// ==============================
function buildTextHTML(text, scheme) {
    const template =
        APP.state.templateHTML || "";

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

    return template
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
function getHighlightScheme(selectedKey) {
    return highlightSchemes[selectedKey] || {
        bg: "#000",
        text: "#fff"
    };
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
        UIState.get("layoutMode");

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
function setupIframeSearch(inputId, buttonId, iframeId, counterId) {
    SearchController.create({
        input: document.getElementById(inputId),
        button: document.getElementById(buttonId),
        iframe: document.getElementById(iframeId),
        counter: document.getElementById(counterId)
    });
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
function loadtheTextFiles() {
    const lastOpened = APP.state.lastOpened || {};

    FRAMES.forEach(frame => {
        const frameId = frame[0];

        loadTextFile(
            frameId,
            lastOpened[frameId] || DEFAULT_FILES[frameId]
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
    UIState.init();
}
	// ======================================
	// END GENERAL FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL EXECUTION
	// ======================================
document.addEventListener("DOMContentLoaded", () => {
    init();
});
async function init() {

    console.log("APP INIT");

    APP.state.lastOpened =
        loadLastOpenedFiles() || {};

    UIState.init();
    UIState.hydrate();

    await TemplateService.ensure();

    console.log(
        "[INIT TEMPLATE READY]",
        APP.state.templateHTML?.length
    );


    setupNavControlsToggle();

    setupVisibilityToggle(
        toggleSearch,
        "hide-search",
        "hideSearch",
        "Show Search",
        "Hide Search"
    );

    setupVisibilityToggle(
        toggleGo,
        "hide-go",
        "hideGo",
        "Show Go",
        "Hide Go"
    );

    setupLayoutToggle();

    buildNavNew();

    setupClickRouter();

    loadtheTextFiles();

    exeIframeSearch();
}
// ==============================
// SAVE HIGHLIGHT SELECTION
// ==============================
if(highlightSelector){
    highlightSelector.addEventListener("change", function(){
        UIState.set("highlightScheme", this.value);
    });
}
// ==============================
// APPLY TO ALL FRAMES
// ==============================
FRAMES.forEach(frame => {

    ScrollService.attach(
        frame[0]
    );

});
// ==============================
// FONT SYSTEM
// ==============================
function setFontSize(size){
    UIState.set("fontSize", size);

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
