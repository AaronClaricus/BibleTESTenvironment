
// ======================================
// DOCUMENT ERROR SERVICE
// Phase 26E
// Handles document pipeline load errors
// ======================================

import {
    FrameService
} from "./rendering.js";

export const DocumentErrorService = {
    getMessage(context, err) {
        const reason =
            err?.message ||
            String(err) ||
            "Unknown error";

        return [
            "Document failed to load.",
            "",
            `Frame: ${context?.frameId || "Unknown frame"}`,
            `File: ${context?.file || "Unknown file"}`,
            `Reason: ${reason}`
        ].join("\n");
    },

    render(context, err) {
        if (!context || !context.iframe) {
            console.warn(
                "[DOCUMENT ERROR] Missing iframe/context",
                {
                    context,
                    err
                }
            );

            return;
        }

        const message =
            this.getMessage(
                context,
                err
            );

        FrameService.renderError(
            context.iframe,
            message
        );

        FrameService.updateTitle(
            context.frameId,
            context.file
        );
    }
};
