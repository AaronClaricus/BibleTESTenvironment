import {
    TemplateService,
    DocumentService,
    DocumentLoadRequest
} from "./documentsp20.js";
import {
    PersistenceService
} from "./storage.js";
import {
	AppState,
	APP,
	UIState
} from "./modules/state.js";
import {
  
    UIService
} from "./uip20.js";
import {
    FrameRegistry,
    FrameService
} from "./renderingp20c.js";
import {
    SearchService
} from "./searchp5.js";

export const EventBus = {
    events: {},
    on(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    },
    off(eventName, handler) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] =
            this.events[eventName].filter(
                registeredHandler =>
                    registeredHandler !== handler
            );
    },
    emit(eventName, payload) {
        const handlers =
            this.events[eventName] || [];
        handlers.forEach(handler => {
            try {
                handler(payload);
            }
            catch (err) {
                console.error(
                    `[EVENT BUS ERROR] ${eventName}`,
                    err
                );
            }
        });
    }
};
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
