import {
    TemplateService,
    DocumentService,
    DocumentLoadRequest
} from "./documents.js";
import {
    EventBus
} from "./event-bus.js";
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
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";
// ======================================
// EVENT BUS HANDLERS
// ======================================
export const EVENTS = {
    DOCUMENT_LOAD: "document:load",
    DOCUMENT_RELOAD: "document:reload",
    DOCUMENTS_RELOAD_ALL: "documents:reloadAll",

    PIPELINE_STARTED: "pipeline:started",
    PIPELINE_FETCHED: "pipeline:fetched",
    PIPELINE_RENDERED: "pipeline:rendered",
    PIPELINE_COMPLETED: "pipeline:completed",
    PIPELINE_FAILED: "pipeline:failed",

    SEARCH_RUN: "search:run",
    SEARCH_CLEAR: "search:clear",
    SEARCH_NEXT: "search:next",
    SEARCH_PREVIOUS: "search:previous",

    UI_RELOAD_ALL: "ui:reloadAll",
    UI_LAYOUT_CHANGE: "ui:layoutChange",
    UI_FONT_CHANGE: "ui:fontChange",
    UI_HIGHLIGHT_CHANGE: "ui:highlightChange"
};
export function registerEventBusHandlers() {
    EventBus.on(
		EVENTS.DOCUMENT_LOAD,
		payload => {
			const request =
				DocumentLoadRequest.fromPayload(payload);

			if (!DocumentLoadRequest.isValid(request)) {
				console.warn("[INVALID DOCUMENT LOAD REQUEST]", payload);
				return;
			}

			DocumentService.load(
				request.frameId,
				request.file,
				request
			);
		}
	);

    EventBus.on(
        EVENTS.DOCUMENT_RELOAD,
        payload => {
            if (!payload) {
                return;
            }

            DocumentService.load(
                payload.frameId,
                payload.file
            );
        }
    );

   EventBus.on(
		EVENTS.DOCUMENTS_RELOAD_ALL,
		() => {
			DocumentSession.reloadAll();
		}
	);
	EventBus.on(
		EVENTS.PIPELINE_COMPLETED,
		payload => {
			DocumentPipelineDebug.log("[EVENT PIPELINE COMPLETED]", payload);
		}
	);

	EventBus.on(
		EVENTS.PIPELINE_FAILED,
		payload => {
			DocumentPipelineDebug.warn("[EVENT PIPELINE FAILED]", payload);
		}
	);
}
