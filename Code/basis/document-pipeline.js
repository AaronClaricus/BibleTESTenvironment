// ======================================
// DOCUMENT PIPELINE
// Phase 26F
// Owns document loading pipeline
// ======================================

import {
    UIState
} from "./state.js";

import {
    EventBus
} from "./event-bus.js";

import {
    EVENTS
} from "./event-names.js";

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
    DocumentPipelineDebug
} from "./config.js";

import {
    DocumentLoadRequest
} from "./document-load-request.js";

import {
    DocumentRepository
} from "./document-repository.js";

import {
    DocumentErrorService
} from "./document-errors.js";

import {
    TemplateService
} from "./template-service.js";

import {
    DocumentSession
} from "./document-session.js";

const StatusUIService = {
    getElement(frameId) {
        return document.querySelector(
            `[data-status-for="${frameId}"]`
        );
    },

    update(context, status) {
        const el =
            this.getElement(context.frameId);

        if (!el) {
            return;
        }

        el.textContent =
            status;

        el.dataset.status =
            status;
    },

    clear(context) {
        const el =
            this.getElement(context.frameId);

        if (!el) {
            return;
        }

        el.textContent =
            "";

        delete el.dataset.status;
    }
};

const PipelineStatusService = {
    set(context, status) {
        context.status =
            status;

        StatusUIService.update(
            context,
            status
        );

        console.log(
            "[DOCUMENT STATUS]",
            {
                frameId: context.frameId,
                file: context.file,
                status
            }
        );
    },

    loading(context) {
        this.set(
            context,
            "loading"
        );
    },

    ready(context) {
        this.set(
            context,
            "ready"
        );

        StatusUIService.clear(
            context
        );
    },

    error(context, err) {
        context.error =
            err;

        this.set(
            context,
            "error"
        );
    }
};

const DocumentPipelineEvents = {
    started(context) {
        EventBus.emit(
            EVENTS.PIPELINE_STARTED,
            {
                frameId: context.frameId,
                file: context.file,
                status: context.status
            }
        );
    },

    fetched(context) {
        EventBus.emit(
            EVENTS.PIPELINE_FETCHED,
            {
                frameId: context.frameId,
                file: context.file,
                textLength: context.text.length
            }
        );
    },

    rendered(context) {
        EventBus.emit(
            EVENTS.PIPELINE_RENDERED,
            {
                frameId: context.frameId,
                file: context.file
            }
        );
    },

    completed(context) {
        EventBus.emit(
            EVENTS.PIPELINE_COMPLETED,
            {
                frameId: context.frameId,
                file: context.file,
                status: context.status
            }
        );
    },

    failed(context, err) {
        EventBus.emit(
            EVENTS.PIPELINE_FAILED,
            {
                frameId: context.frameId,
                file: context.file,
                status: context.status,
                error: err
            }
        );
    }
};

export const DocumentPipeline = {
    createContext(frameId, file, options = {}) {
        const request =
            DocumentLoadRequest.normalize({
                frameId,
                file,
                ...options
            });

        return {
            request,
            frameId: request.frameId,
            file: request.file,
            source: request.source,
            restoreScroll: request.restoreScroll,
            resetSearch: request.resetSearch,
            saveHistory: request.saveHistory,
            iframe: FrameRegistry.get(request.frameId),
            text: "",
            scheme: null,
            status: "idle",
            error: null
        };
    },

    validate(context) {
        if (!context.iframe || !context.file) {
            DocumentPipelineDebug.warn(
                "[DOCUMENT PIPELINE BLOCKED]",
                {
                    frameId: context.frameId,
                    file: context.file
                }
            );

            return false;
        }

        return true;
    },

    start(context) {
        PipelineStatusService.loading(
            context
        );

        DocumentPipelineDebug.log(
            "[DOCUMENT PIPELINE START]",
            {
                frameId: context.frameId,
                file: context.file
            }
        );

        DocumentSession.setActive(
			context.frameId,
			context.file
		);

        DocumentPipelineEvents.started(
            context
        );
    },

    async ensureTemplate() {
        await TemplateService.ensure();
    },

    async fetchDocument(context) {
        context.text =
            await DocumentRepository.fetch(
                context.file
            );
    },

    prepareScheme(context) {
        context.scheme =
            UIService.getHighlightScheme(
                UIState.get("highlightScheme")
            );
    },

    render(context) {
        FrameService.render(
            context.iframe,
            context.text,
            context.scheme
        );
    },

    afterRender(context) {
        FrameService.updateTitle(
            context.frameId,
            context.file
        );

        SearchService.resetFrame(
            context.iframe
        );

        DocumentPipelineEvents.rendered(
            context
        );
    },

    fail(context, err) {
        PipelineStatusService.error(
            context,
            err
        );

        DocumentPipelineEvents.failed(
            context,
            err
        );

        DocumentPipelineDebug.error(
            "[DOCUMENT PIPELINE ERROR]",
            err
        );

        DocumentErrorService.render(
            context,
            err
        );
    },

    complete(context) {
        PipelineStatusService.ready(
            context
        );

        DocumentPipelineDebug.log(
            "[DOCUMENT PIPELINE COMPLETE]",
            {
                frameId: context.frameId,
                file: context.file
            }
        );

        DocumentPipelineEvents.completed(
            context
        );
    },

    beforeFetch(context) {
        console.log(
            "[PIPELINE BEFORE FETCH]",
            {
                frameId: context.frameId,
                file: context.file
            }
        );
    },

    afterFetch(context) {
        console.log(
            "[PIPELINE AFTER FETCH]",
            {
                frameId: context.frameId,
                file: context.file,
                textLength: context.text.length
            }
        );

        DocumentPipelineEvents.fetched(
            context
        );
    },

    beforeRender(context) {
        console.log(
            "[PIPELINE BEFORE RENDER]",
            {
                frameId: context.frameId,
                file: context.file
            }
        );
    },

    afterComplete(context) {
        console.log(
            "[PIPELINE AFTER COMPLETE]",
            {
                frameId: context.frameId,
                file: context.file
            }
        );
    },

    async load(frameId, file, options = {}) {
        const context =
            this.createContext(
                frameId,
                file,
                options
            );

        if (!this.validate(context)) {
            return;
        }

        try {
            this.start(
                context
            );

            await this.ensureTemplate();

            this.beforeFetch(
                context
            );

            await this.fetchDocument(
                context
            );

            this.afterFetch(
                context
            );

            this.prepareScheme(
                context
            );

            this.beforeRender(
                context
            );

            this.render(
                context
            );

            this.afterRender(
                context
            );

            this.complete(
                context
            );

            this.afterComplete(
                context
            );
        } catch (err) {
            this.fail(
                context,
                err
            );
        }
    }
};
