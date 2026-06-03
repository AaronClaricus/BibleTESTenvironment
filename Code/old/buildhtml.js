// ==============================
// TEMPLATE CACHE
// ==============================
let TEMPLATE_HTML = "";
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
