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
// FILE LINKS
// ==========================================
function getLayoutMode(){
    return UIState.get("layoutMode");
}

function setLayoutMode(mode){
    UIState.set("layoutMode", mode);
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
// UI BINDINGS
// ======================================

const UIBindings = {

    setupVisibilityToggle(
        button,
        bodyClass,
        stateKey,
        showText,
        hideText
    ) {

        if (!button) {
            return;
        }

        const value =
            UIState.get(
                stateKey
            );

        document.body.classList.toggle(
            bodyClass,
            value
        );

        button.textContent =
            value ? showText : hideText;

        button.addEventListener(
            "click",
            () => {

                const newValue =
                    !UIState.get(
                        stateKey
                    );

                UIState.set(
                    stateKey,
                    newValue
                );

                button.textContent =
                    newValue ? showText : hideText;
            }
        );
    },

    setupLayoutToggle() {

        if (!toggleButton) {
            return;
        }

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
    },

    setupHighlightSelector() {

        if (!highlightSelector) {
            return;
        }

        highlightSelector.addEventListener(
            "change",
            function() {

                UIState.set(
                    "highlightScheme",
                    this.value
                );
            }
        );
    },

    setupFontSelector() {

        if (!fontSelector) {
            return;
        }

        fontSelector.addEventListener(
            "change",
            function() {

                setFontSize(
                    this.value
                );

                EventBus.emit(
                    "documents:reloadAll"
                );
            }
        );
    },

    setupSearchControllers() {

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
    },

    setupScrollTracking() {

        FRAMES.forEach(frame => {

            ScrollService.attach(
                frame[0]
            );

        });
    }

};

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
async function init(){

    console.log("APP INIT");

    StateManager.hydrate();

    UIState.init();

    UIState.hydrate();

    await TemplateService.ensure();

    NavigationService.buildNavigation();

    registerEventHandlers();

    Router.init();

    NavigationService.setupTreeToggle();

    UIBindings.setupVisibilityToggle(
        toggleSearch,
        "hide-search",
        "hideSearch",
        "Show Search",
        "Hide Search"
    );

    UIBindings.setupVisibilityToggle(
        toggleGo,
        "hide-go",
        "hideGo",
        "Show Go",
        "Hide Go"
    );
	UIBindings.setupVisibilityToggle(
		toggleControls,
		"hide-controls",
		"hideControls",
		"Show Controls",
		"Hide Controls"
	);
    UIBindings.setupLayoutToggle();

    UIBindings.setupHighlightSelector();

    UIBindings.setupFontSelector();

    UIBindings.setupSearchControllers();

    UIBindings.setupScrollTracking();

    DocumentService.restoreLast();

}


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


	// ======================================
	// END GENERAL EXECUTION
	// ======================================
