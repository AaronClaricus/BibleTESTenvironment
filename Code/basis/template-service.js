
// ======================================
// TEMPLATE SERVICE
// Phase 26F
// Owns template fetch/cache
// ======================================

import {
    APP
} from "./state.js";

const TemplateRepository = {
    async fetch() {
        const response =
            await fetch("./Code/template.html");

        console.log(
            "[TEMPLATE FETCH]",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                "Template fetch failed: " +
                response.status
            );
        }

        return await response.text();
    }
};

export const TemplateService = {
    async ensure() {
        console.log(
            "[TEMPLATE] ensure called"
        );

        if (APP.state.templateHTML) {
            console.log(
                "[TEMPLATE] already cached"
            );

            return;
        }

        const html =
            await TemplateRepository.fetch();

        APP.state.templateHTML =
            html;

        console.log(
            "[TEMPLATE] stored",
            APP.state.templateHTML?.length
        );
    }
};
