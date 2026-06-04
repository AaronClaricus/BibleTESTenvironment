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
