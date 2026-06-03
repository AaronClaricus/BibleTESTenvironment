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
async function loadTextFile(
    frameId,
    file
) {

    return DocumentService.load(
        frameId,
        file
    );

}
	// ======================================
	// END ASYNC FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL FUNCTIONS
	// ======================================


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
	DocumentService.setActive(
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
// APPLY LAYOUT
// ==============================
function applyLayoutMode() {

    return UIService.applyLayoutMode();

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

    return DocumentService.restoreLast();

}
// ======================================
// INITIALIZE ALL 4 SEARCHES
// ======================================
function exeIframeSearch(){

    SearchController.create({
        input: document.getElementById("search"),
        button: document.getElementById("go"),
        iframe: document.getElementById("frameB"),
        counter: document.getElementById("countB")
    });

    SearchController.create({
        input: document.getElementById("searchC"),
        button: document.getElementById("goC"),
        iframe: document.getElementById("frameC"),
        counter: document.getElementById("countC")
    });

    SearchController.create({
        input: document.getElementById("searchD"),
        button: document.getElementById("goD"),
        iframe: document.getElementById("frameD"),
        counter: document.getElementById("countD")
    });

    SearchController.create({
        input: document.getElementById("searchE"),
        button: document.getElementById("goE"),
        iframe: document.getElementById("frameE"),
        counter: document.getElementById("countE")
    });
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

    StateManager.hydrate();

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

    NavigationService.buildNavigation();

	registerEventHandlers();

	Router.init();

	NavigationService.setupTreeToggle();

	DocumentService.restoreLast();
	DocumentIndex.build();

	console.log(
		"[DOCUMENT INDEX READY]",
		DocumentIndex.query("john")
	);
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
function setFontSize(size){

    UIState.set(
        "fontSize",
        size
    );

    if(fontSelector){

        fontSelector.value =
            size;
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

            DocumentService.reloadAll();
        }
    );
}
// apply immediately
	// ======================================
	// END GENERAL EXECUTION
	// ======================================
