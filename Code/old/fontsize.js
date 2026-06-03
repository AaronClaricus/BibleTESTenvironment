 // ==============================
 // FONT SIZE CONTROL
 // ==============================
    const fontSelector = document.getElementById("fontSelector");
    if(fontSelector){
        fontSelector.addEventListener("change", function(){
            document.documentElement.style.setProperty("--font-size", this.value);
            updateIframeFonts();
        });
    }
// ==============================
// UPDATE IFRAME FONT SIZE
// ==============================
function updateIframeFonts(){
    ["frameB","frameC","frameD"].forEach(function(id){
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
