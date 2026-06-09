
export const DocumentLoadRequest = {
    create(frameId, file, options = {}) {
        return {
            frameId,
            file,
            source: options.source || "unknown",
            restoreScroll: options.restoreScroll !== false,
            saveHistory: options.saveHistory !== false
        };
    },

    fromPayload(payload) {
        if (!payload) {
            return null;
        }

        return {
            frameId: payload.frameId,
            file: payload.file,
            source: payload.source || "unknown",
            restoreScroll: payload.restoreScroll !== false,
            saveHistory: payload.saveHistory !== false
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
