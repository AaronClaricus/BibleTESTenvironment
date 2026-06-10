// ======================================
// DOCUMENT LOAD REQUEST
// Phase 26C
// Normalizes all document load inputs
// ======================================

export const DocumentLoadRequest = {
    create(frameId, file, options = {}) {
        return this.normalize({
            frameId,
            file,
            source: options.source || "unknown",
            restoreScroll: options.restoreScroll,
            saveHistory: options.saveHistory,
            resetSearch: options.resetSearch
        });
    },

    normalize(input) {
        if (typeof input === "string") {
            return this.create(null, input);
        }

        if (!input || typeof input !== "object") {
            return this.empty();
        }

        return {
            frameId:
                input.frameId ||
                input.frame ||
                null,

            file:
                input.file ||
                input.filePath ||
                "",

            source:
                input.source ||
                "unknown",

            restoreScroll:
                input.restoreScroll !== false,

            saveHistory:
                input.saveHistory !== false,

            resetSearch:
                input.resetSearch !== false
        };
    },

    fromPayload(payload) {
        return this.normalize(payload);
    },

    empty() {
        return {
            frameId: null,
            file: "",
            source: "empty",
            restoreScroll: true,
            saveHistory: true,
            resetSearch: true
        };
    },

    isValid(request) {
        return Boolean(
            request &&
            request.frameId &&
            request.file
        );
    }
};
