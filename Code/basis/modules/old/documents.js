// ======================================
// DOCUMENT LOAD PIPELINE
// ======================================
async function loadDocumentPipeline(
    frameId,
    file
) {
    const iframe =
        document.getElementById(
            frameId
        );
    if (!iframe) {
        console.warn(
            "[PIPELINE BLOCKED] Missing iframe",
            {
                frameId,
                file
            }
        );
        return;
    }
    try {
        DocumentService.setActive(
            frameId,
            file
        );
        await TemplateService.ensure();
        const text =
            await DocumentRepository.fetch(
                file
            );
        const scheme =
            UIService.getHighlightScheme(
                UIState.get(
                    "highlightScheme"
                )
            );
        console.log(
            "[DOCUMENT PIPELINE]",
            {
                frameId,
                file,
                length: text?.length
            }
        );
        FrameService.render(
            iframe,
            text,
            scheme
        );
        SearchService.resetFrame(
            iframe
        );
    }
    catch (err) {
        FrameService.renderError(
            iframe,
            err
        );
    }
}
const FileService = {
    _cache: new Map(),
    _order: [],
    async get(file) {
        if (this._cache.has(file)) {
            return this._cache.get(file);
        }
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${file}`);
        }
        const text = await response.text();
        this._cache.set(file, text);
        this._order.push(file);

        if (this._order.length > CONFIG.cache.maxFiles) {
            const oldest = this._order.shift();
            this._cache.delete(oldest);
        }
        return text;
    }
};
// ======================================
// DOCUMENT REPOSITORY
// ======================================
const DocumentRepository = {
    async fetch(file) {

        return FileService.get(
            file
        );
    },
    async preload(files) {
        return Promise.all(
            files.map(
                file =>
                    this.fetch(file)
            )
        );
    },
    async exists(file) {
        try {
            await this.fetch(file);
            return true;
        }
        catch {

            return false;
        }
    }
};
const DocumentService = {
    async load(
		frameId,
		file
	) {
		return loadDocumentPipeline(
			frameId,
			file
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
		FRAMES.forEach(frame => {
			const frameId =
				frame[0];

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
		});
	},
    // ------------------
    // RESTORE LAST OPENED
    // ------------------
    restoreLast() {
        const lastOpened =
            AppState.getLastOpened() || {};
        FRAMES.forEach(frame => {
            const frameId =
                frame[0];
            const file =
                lastOpened[frameId] ||
                DEFAULT_FILES[frameId];
            console.log(
                "[DOCUMENT RESTORE LAST]",
                {
                    frameId,
                    file
                }
            );
            this.load(
                frameId,
                file
            );
        });
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
const TemplateService = {
    async ensure() {
        console.log("[TEMPLATE] ensure called");
        if (APP.state.templateHTML) {
            console.log("[TEMPLATE] already cached");
            return;
        }
        const response =
            await fetch("./Code/template.html");
        console.log(
            "[TEMPLATE] response",
            response.status
        );
        const html =
            await response.text();
        console.log(
            "[TEMPLATE] length",
            html.length
        );
        APP.state.templateHTML = html;
        console.log(
            "[TEMPLATE] stored",
            APP.state.templateHTML?.length
        );
    }
};
