import {
    TemplateService,
    DocumentService,
    DocumentSession
} from "./documents.js";
import {
    DocumentLoadRequest
} from "./document-load-request.js";
import {
    EventBus
} from "./event-bus.js";
import {
    PersistenceService
} from "./documents.js";
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
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";
import { EVENTS } from "./event-names.js";
import {
    AppStorage
    
} from "./storage.js";
// ======================================
// EVENT BUS HANDLERS
// ======================================

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
