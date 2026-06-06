
// ======================================
// HTML RENDERER
// ======================================
const HTMLRenderer = {
    build(
        text,
        scheme
    ) {
        const template =
            APP.state.templateHTML || "";
        const size =
            getComputedStyle(
                document.documentElement
            ).getPropertyValue(
                "--font-size"
            );
        const content =
            text && text.trim()
                ? this.escape(text)
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
            .replaceAll(
                "__FONT_SIZE__",
                size
            )
            .replaceAll(
                "__HIGHLIGHT_BG__",
                scheme.bg
            )
            .replaceAll(
                "__HIGHLIGHT_TEXT__",
                scheme.text
            )
            .replace(
                "__CONTENT__",
                content
            );
    },
    escape(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
};
const FrameRegistry = {

    get(frameId) {
        return document.getElementById(frameId);
    },

    exists(frameId) {
        return !!this.get(frameId);
    },

    getAll() {
        return FRAMES
            .map(frame => this.get(frame[0]))
            .filter(Boolean);
    }
};
const FrameService = {
    render(iframe, text, scheme) {
        console.log("[RENDER CHECK]", {
            hasTemplate: !!APP.state.templateHTML,
            templateLength: APP.state.templateHTML?.length,
            textLength: text?.length
        });
        iframe.srcdoc =
			HTMLRenderer.build(
				text,
				scheme
		);
    },
    renderError(iframe, err) {
		console.error(err);
		iframe.srcdoc =
			HTMLRenderer.build(
				"ERROR",
				{
					bg: "#400",
					text: "#fff"
				}
			);
	},
    updateTitle(
        frameId,
        filePath
    ) {
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
            filePath.split("/")
                .pop();
        titleBar.textContent =
            fileName;
    },
	reloadAll() {
		EventBus.emit(EVENTS.DOCUMENTS_RELOAD_ALL);
	}
};
