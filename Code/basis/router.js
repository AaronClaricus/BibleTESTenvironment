import {
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";

import {
    EventBus
} from "./event-bus.js";

import {
    EVENTS
} from "./event-names.js";

import {
    DocumentLoadRequest
} from "./document-load-request.js";
export const Router = {
    init() {
        this.bindDocumentLinks();
    },
    bindDocumentLinks() {
        document.addEventListener(
            "click",
            e => {
                const fileLink =
                    e.target.closest(
                        ".file-link"
                    );
                if (!fileLink) {
                    return;
                }
                e.preventDefault();
                this.openDocumentFromLink(
                    fileLink
                );
            }
        );
    },
    openDocumentFromLink(fileLink) {
        const frameId =
            fileLink.dataset.frame;
        const file =
            fileLink.dataset.file;
        if (!frameId || !file) {
            console.warn(
                "[ROUTER] Missing frame or file",
                {
                    frameId,
                    file
                }
            );
            return;
        }
        this.navigateToDocument(
            frameId,
            file
        );
    },
    navigateToDocument(frameId, file) {
        EventBus.emit(
			EVENTS.DOCUMENT_LOAD,
			DocumentLoadRequest.create(
				frameId,
				file,
				{
					source: "navigation"
				}
			)
		);
    }
};
