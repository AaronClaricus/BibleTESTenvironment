
// ======================================
// DOCUMENT SERVICE
// Phase 26G
// Public document coordinator
// ======================================

import {
    AppState
} from "./state.js";

import {
    EventBus
} from "./event-bus.js";

import {
    DocumentPipeline
} from "./document-pipeline.js";

import {
    DocumentSession,
    PersistenceService
} from "./document-session.js";

export const DocumentService = {
    async load(frameId, file, options = {}) {
        return DocumentPipeline.load(
            frameId,
            file,
            options
        );
    },

    setActive(frameId, file) {
        console.log(
            "[DOCUMENT ACTIVE]",
            {
                frameId,
                file
            }
        );

        AppState.setCurrentFile(
            frameId,
            file
        );

        PersistenceService.saveLastOpened(
            frameId,
            file
        );
    },

    getCurrent(frameId) {
        return AppState.getCurrentFile(
            frameId
        );
    },

    getActive(frameId) {
        return AppState.getCurrentFile(
            frameId
        );
    },

    reload(frameId) {
        const file =
            AppState.getCurrentFile(
                frameId
            );

        if (!file) {
            return;
        }

        EventBus.emit(
            "document:reload",
            {
                frameId,
                file
            }
        );
    },

    reloadAll() {
        return DocumentSession.reloadAll();
    },

    getLastOpened() {
        return AppState.getLastOpened() || {};
    },

    restoreLast() {
        return DocumentSession.restoreLast();
    }
};
