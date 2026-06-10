import {
    StateManager,
	APP,
	UIState,
	AppState
} from "./state.js";
import {
    EventBus
} from "./event-bus.js";
import { EVENTS } from "./event-names.js";

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
import {
    DocumentLoadRequest
} from "./document-load-request.js";

import {
    FileService
} from "./file-service.js";
import {
    DocumentRepository
} from "./document-repository.js";
import {
    DocumentSession,
    PersistenceService
} from "./document-session.js";
import {
    DocumentErrorService
} from "./document-errors.js";
import {
    DocumentPipeline
} from "./document-pipeline.js";

import {
    TemplateService
} from "./template-service.js";




// ======================================
// DOCUMENT INDEX
// ======================================
const DocumentIndex = {
    _index: [],
    build(documents = []) {
        this._index =
            documents.map(document => {
                return {
                    id: document.id || document.file,
                    title: document.title || "",
                    file: document.file || "",
                    text: document.text || ""
                };

            });
        console.log(
            "[DOCUMENT INDEX BUILT]",
            this._index.length
        );
        return this._index;
    },
    query(term) {
        if (!term) {
            return [];
        }
        const needle =
            term.toLowerCase();
        return this._index.filter(entry => {
            return (
                entry.title.toLowerCase().includes(needle) ||
                entry.file.toLowerCase().includes(needle) ||
                entry.text.toLowerCase().includes(needle)
            );
        });
    },
    clear() {
        this._index = [];
        console.log(
            "[DOCUMENT INDEX CLEARED]"
        );
    }
}; 
// ======================================
// DOCUMENTS BARREL
// Temporary compatibility exports
// ======================================

export {
    DocumentService
} from "./document-service.js";

export {
    DocumentRepository
} from "./document-repository.js";

export {
    FileService
} from "./file-service.js";

export {
    TemplateService
} from "./template-service.js";

export {
    DocumentSession,
    PersistenceService
} from "./document-session.js";
