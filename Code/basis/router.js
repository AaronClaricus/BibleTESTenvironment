import {
    TemplateService,
    DocumentService,
    DocumentLoadRequest
} from "./documents.js";
import {
    PersistenceService
} from "./storage.js";
import {
	AppState,
	APP,
	UIState
} from "./state.js";
import {
  
    UIService
} from "./ui.js";
import {
    FrameRegistry,
    FrameService
} from "./rendering.js";
import {
    SearchService
} from "./search.js";
import {
    DocumentSession
} from "./documents.js";
import {
   
    EVENTS
} from "./events.js";
import {
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";
import {
    EventBus
} from "./event-bus.js";
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
