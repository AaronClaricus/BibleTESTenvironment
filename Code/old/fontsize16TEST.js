 // ==============================
// FONT STORAGE
// ==============================
const FONT_SIZE_KEY =
    "saved-font-size";
 
 
 // ==============================
// FONT SIZE CONTROL
// ==============================
const fontSelector =
    document.getElementById(
        "fontSelector"
    );
// ==============================
// HIGHLIGHT STORAGE
// ==============================
const HIGHLIGHT_KEY =
    "saved-highlight";
// ==============================
// HIGHLIGHT SELECTOR
// ==============================
const highlightSelector =
    document.getElementById(
        "highlightSelector"
    );

// ==============================
// RESTORE SAVED HIGHLIGHT
// ==============================
const savedHighlight =
    localStorage.getItem(
        HIGHLIGHT_KEY
    );

if(savedHighlight && highlightSelector){

    highlightSelector.value =
        savedHighlight;
}
// ==============================
// APPLY SAVED HIGHLIGHT
// AFTER INITIAL LOAD
// ==============================
window.addEventListener(
    "load",
    () => {

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
// ==============================
// RESTORE SAVED FONT SIZE
// ==============================
const savedFontSize =
    localStorage.getItem(
        FONT_SIZE_KEY
    );

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
