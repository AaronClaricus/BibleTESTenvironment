
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
