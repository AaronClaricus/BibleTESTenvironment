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

};


	// ======================================
	// END GENERAL FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL EXECUTION
	// ======================================
window.addEventListener(
    "load",
    () => {
        StartupService.init();
    }
);
const StartupService = {

    async init() {

        registerEventBusHandlers();

        buildNavigation(
            "navA",
            NAVIGATION
        );

        SearchBindingsService.init();

        ScrollTrackingService.init();

        LayoutService.init();

        FontService.init();

        HighlightService.init();

        VisibilityService.init();

        UIState.hydrate();

    }
};

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
