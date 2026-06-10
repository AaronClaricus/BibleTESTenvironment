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
// ======================================
// DOCUMENT LOAD PIPELINE
// ======================================

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

        el.textContent = status;

        el.dataset.status = status;
    },

    clear(context) {
        const el =
            this.getElement(context.frameId);

        if (!el) {
            return;
        }

        el.textContent = "";

        delete el.dataset.status;
    }
};

const PipelineStatusService = {

    set(context, status) {
		context.status = status;

		StatusUIService.update(
			context,
			status
		);

		console.log("[DOCUMENT STATUS]", {
			frameId: context.frameId,
			file: context.file,
			status
		});
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

		StatusUIService.clear(context);
	},

    error(context, err) {
        context.error = err;

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



const DocumentPipeline = {

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
		PipelineStatusService.loading(context);

		DocumentPipelineDebug.log(
			"[DOCUMENT PIPELINE START]",
			{
				frameId: context.frameId,
				file: context.file
			}
		);

		DocumentService.setActive(
			context.frameId,
			context.file
		);
		DocumentPipelineEvents.started(context);
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

		DocumentPipelineEvents.rendered(context);
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

		FrameService.renderError(
			context.iframe,
			err
		);

		FrameService.updateTitle(
			context.frameId,
			context.file
		);
		
	},

    complete(context) {
		PipelineStatusService.ready(context);

		DocumentPipelineDebug.log(
			"[DOCUMENT PIPELINE COMPLETE]",
			{
				frameId: context.frameId,
				file: context.file
			}
		);
		DocumentPipelineEvents.completed(context);
	},
	beforeFetch(context) {
		console.log("[PIPELINE BEFORE FETCH]", {
			frameId: context.frameId,
			file: context.file
		});
	},

	afterFetch(context) {
		console.log("[PIPELINE AFTER FETCH]", {
			frameId: context.frameId,
			file: context.file,
			textLength: context.text.length
		});
		DocumentPipelineEvents.fetched(context);
	},

	beforeRender(context) {
		console.log("[PIPELINE BEFORE RENDER]", {
			frameId: context.frameId,
			file: context.file
		});
	},

	afterComplete(context) {
		console.log("[PIPELINE AFTER COMPLETE]", {
			frameId: context.frameId,
			file: context.file
		});
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
            this.start(context);

           await this.ensureTemplate();

			this.beforeFetch(context);

			await this.fetchDocument(context);

			this.afterFetch(context);

			this.prepareScheme(context);

			this.beforeRender(context);

			this.render(context);

			this.afterRender(context);

			this.complete(context);

			this.afterComplete(context);
        }
        catch (err) {
            this.fail(context, err);
        }
    }
};


// ======================================
// DOCUMENT REPOSITORY
// ======================================

export const DocumentService = {
	 async load(frameId, file, options = {}) {
		return DocumentPipeline.load(
			frameId,
			file,
			options
		);
	},
		setActive(
        frameId,
        file
    ) {
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
		return AppState.getCurrentFile(frameId);
	},
    getActive(
        frameId
    ) {
        return AppState.getCurrentFile(
            frameId
        );
    },
    // ------------------
    // RELOAD ONE DOCUMENT
    // ------------------
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
    // ------------------
    // RELOAD ALL DOCUMENTS
    // ------------------
	reloadAll() {
		return DocumentSession.reloadAll();
	},
	getLastOpened() {
		return AppState.getLastOpened() || {};
	},
    // ------------------
    // RESTORE LAST OPENED
    // ------------------
	 restoreLast() {
		return DocumentSession.restoreLast();
	}
};
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
        console.log("[TEMPLATE] ensure called");

        if (APP.state.templateHTML) {
            console.log("[TEMPLATE] already cached");
            return;
        }

        const html =
            await TemplateRepository.fetch();

        APP.state.templateHTML = html;

        console.log(
            "[TEMPLATE] stored",
            APP.state.templateHTML?.length
        );
    }
};
