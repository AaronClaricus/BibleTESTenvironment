// ======================================
// DOCUMENT SESSION SERVICE
// Phase 26D
// Handles restore/reload session behavior
// ======================================

import {
    AppState
} from "./state.js";

import {
    AppStorage
} from "./storage.js";

import {
    ConfigService
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

export const PersistenceService = {
    saveLastOpened(frameId, file) {
        AppStorage.lastOpened.setFile(
            frameId,
            file
        );

        const current =
            AppState.getLastOpened() || {};

        current[frameId] =
            file;

        AppState.setLastOpened(
            current
        );
    }
};

export const DocumentSession = {
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

    getLastOpened() {
        return AppState.getLastOpened() || {};
    },

    restoreLast() {
        const lastOpened =
            this.getLastOpened();

        ConfigService.getFrames().forEach(frame => {
            const frameId =
                frame[0];

            const file =
                lastOpened[frameId] ||
                ConfigService.getDefaultFiles()[frameId];

            if (!file) {
                console.warn(
                    "[DOCUMENT SESSION RESTORE] No file for frame:",
                    frameId
                );

                return;
            }

            console.log(
                "[DOCUMENT SESSION RESTORE]",
                {
                    frameId,
                    file
                }
            );

            EventBus.emit(
                EVENTS.DOCUMENT_LOAD,
                DocumentLoadRequest.create(
                    frameId,
                    file,
                    {
                        source: "restore"
                    }
                )
            );
        });
    },

    reloadAll() {
        ConfigService.getFrames().forEach(frame => {
            const frameId =
                frame[0];

            const file =
                this.getCurrent(frameId);

            if (!file) {
                console.warn(
                    "[DOCUMENT SESSION RELOAD SKIPPED]",
                    {
                        frameId,
                        file
                    }
                );

                return;
            }

            EventBus.emit(
                EVENTS.DOCUMENT_LOAD,
                DocumentLoadRequest.create(
                    frameId,
                    file,
                    {
                        source: "reload"
                    }
                )
            );
        });
    }
};
