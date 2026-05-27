
// ==============================
// IFRAME SCROLL MANAGER
// ==============================
const IframeScrollManager = (() => {

    // ==============================
    // PERSISTENT SCROLL POSITIONS
    // ==============================
    const positions = {

        frameB: 0,
        frameC: 0,
        frameD: 0

    };


    // ==============================
    // GET SCROLL TARGET
    // ==============================
    function getScrollElement(doc) {

        if (!doc) return null;

        return doc.getElementById(
            "content"
        );

    }


    // ==============================
    // SAVE CURRENT POSITION
    // ==============================
    function save(frameId, scrollEl) {

        if (!scrollEl) return;

        positions[frameId] =
            scrollEl.scrollTop;

        // DEBUG
        console.log(
            "[SAVE]",
            frameId,
            positions[frameId]
        );

    }


    // ==============================
    // CAPTURE POSITION BEFORE RELOAD
    // ==============================
    function captureCurrentPosition(
        iframe,
        frameId
    ) {

        try {

            const doc =
                iframe.contentDocument;

            if (!doc) return;

            const scrollEl =
                getScrollElement(doc);

            if (!scrollEl) return;

            save(frameId, scrollEl);

        } catch (err) {

            console.warn(
                "[CAPTURE FAILED]",
                frameId,
                err
            );

        }

    }


    // ==============================
    // RESTORE POSITION
    // ==============================
    function restore(frameId, scrollEl) {

        if (!scrollEl) return;

        const target =
            positions[frameId] || 0;

        console.log(
            "[RESTORE START]",
            frameId,
            "TARGET:",
            target
        );

        // ==============================
        // WAIT FOR LAYOUT STABILIZATION
        // ==============================
        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                scrollEl.scrollTop =
                    target;

                console.log(
                    "[RESTORE APPLY]",
                    frameId,
                    scrollEl.scrollTop
                );

            });

        });

    }


    // ==============================
    // INITIALIZE IFRAME
    // ==============================
    function initialize(
        iframe,
        frameId
    ) {

        try {

            const doc =
                iframe.contentDocument;

            if (!doc) {

                console.warn(
                    "[INIT] NO DOCUMENT",
                    frameId
                );

                return;

            }

            const scrollEl =
                getScrollElement(doc);

            if (!scrollEl) {

                console.warn(
                    "[INIT] #content NOT FOUND",
                    frameId
                );

                return;

            }

            // DEBUG
            console.log(
                "[INIT SUCCESS]",
                frameId,
                scrollEl,
                "SCROLL HEIGHT:",
                scrollEl.scrollHeight
            );

            // ==============================
            // RESTORE SCROLL POSITION
            // ==============================
            restore(
                frameId,
                scrollEl
            );

            // ==============================
            // TRACK SCROLLING
            // ==============================
            const onScroll = () => {

                save(
                    frameId,
                    scrollEl
                );

            };

            scrollEl.addEventListener(
                "scroll",
                onScroll,
                { passive: true }
            );

            // ==============================
            // STORE CLEANUP
            // ==============================
            iframe._scrollCleanup =
                () => {

                    scrollEl.removeEventListener(
                        "scroll",
                        onScroll
                    );

                };

        } catch (err) {

            console.error(
                "[INIT ERROR]",
                frameId,
                err
            );

        }

    }


    // ==============================
    // CLEANUP OLD LISTENERS
    // ==============================
    function cleanup(iframe) {

        if (
            typeof iframe._scrollCleanup
            === "function"
        ) {

            iframe._scrollCleanup();

        }

        iframe._scrollCleanup =
            null;

    }


    // ==============================
    // PUBLIC API
    // ==============================
    return {

        initialize,
        cleanup,
        captureCurrentPosition

    };

})();


// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {

    console.log(
        "[LOAD START]",
        frameId,
        file
    );

    // ==============================
    // GET IFRAME
    // ==============================
    const iframe =
        document.getElementById(
            frameId
        );

    if (!iframe) {

        console.warn(
            "[LOAD] IFRAME NOT FOUND",
            frameId
        );

        return;

    }

    // ==============================
    // SAVE CURRENT SCROLL
    // BEFORE REPLACING CONTENT
    // ==============================
    IframeScrollManager
        .captureCurrentPosition(
            iframe,
            frameId
        );

    // ==============================
    // REMOVE OLD LISTENERS
    // ==============================
    IframeScrollManager.cleanup(
        iframe
    );

    // ==============================
    // UPDATE CURRENT FILE
    // ==============================
    currentFiles[frameId] =
        file;

    try {

        // ==============================
        // LOAD TEMPLATE
        // ==============================
        await initTemplate();

        // ==============================
        // LOAD TEXT FILE
        // ==============================
        const response =
            await fetch(file);

        const text =
            await response.text();

        // ==============================
        // GET HIGHLIGHT SCHEME
        // ==============================
        const selected =
            document.getElementById(
                "highlightSelector"
            )?.value;

        const scheme =

            (
                typeof highlightSchemes
                !== "undefined"

                &&

                highlightSchemes[selected]
            )

            ||

            {

                bg: "#000",
                text: "#fff"

            };

        // ==============================
        // BUILD HTML
        // ==============================
        const html =
            buildTextHTML(
                text,
                scheme
            );

        // ==============================
        // WAIT FOR IFRAME LOAD
        // IMPORTANT:
        // MUST OCCUR BEFORE srcdoc
        // ==============================
        iframe.addEventListener(

            "load",

            () => {

                console.log(
                    "[IFRAME LOADED]",
                    frameId
                );

                // ==============================
                // INITIALIZE SCROLL SYSTEM
                // ==============================
                IframeScrollManager
                    .initialize(
                        iframe,
                        frameId
                    );

                // ==============================
                // UPDATE TITLE
                // ==============================
                updateIframeTitle(
                    frameId,
                    file
                );

            },

            { once: true }

        );

        // ==============================
        // LOAD HTML INTO IFRAME
        // ==============================
        iframe.srcdoc = html;

    } catch (err) {

        console.error(
            "[LOAD ERROR]",
            frameId,
            err
        );

        iframe.srcdoc =
            buildTextHTML(
                "ERROR LOADING FILE",
                {

                    bg: "#400",
                    text: "#fff"

                }
            );

    }

}


// ==============================
// WINDOW LOAD
// ==============================
window.addEventListener(

    "load",

    () => {

        console.log(
            "[MAIN SCRIPT LOADED]"
        );

        // ==============================
        // FILE LINK HANDLERS
        // ==============================
        document
            .querySelectorAll(
                ".file-link"
            )

            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        loadTextFile(

                            link.dataset.frame,

                            link.dataset.file

                        );

                    }
                );

            });

        // ==============================
        // DEFAULT LOADS
        // ==============================
        loadTextFile(
            "frameB",
            "./General Sources/Introduction"
        );

        loadTextFile(
            "frameC",
            "./Gospel/John"
        );

        loadTextFile(
            "frameD",
            "./General Sources/Resources"
        );

    }

);
