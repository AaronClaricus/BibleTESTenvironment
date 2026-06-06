// ======================================
// DOCUMENT LOAD PIPELINE
// ======================================
const DocumentPipeline = {

    async load(frameId, file) {
        const iframe =
            document.getElementById(frameId);

        if (!iframe || !file) {
            console.warn("[DOCUMENT PIPELINE BLOCKED]", {
                frameId,
                file
            });
            return;
        }

        try {
            console.log("[DOCUMENT PIPELINE START]", {
                frameId,
                file
            });

            DocumentService.setActive(
                frameId,
                file
            );

            await TemplateService.ensure();

            const text =
                await DocumentRepository.fetch(file);

            const scheme =
                UIService.getHighlightScheme(
                    UIState.get("highlightScheme")
                );

            FrameService.render(
                iframe,
                text,
                scheme
            );

            FrameService.updateTitle(
                frameId,
                file
            );

            SearchService.resetFrame(iframe);

            ScrollService.restore(
                frameId,
                iframe
            );

            console.log("[DOCUMENT PIPELINE COMPLETE]", {
                frameId,
                file
            });
        }
        catch (err) {
            console.error("[DOCUMENT PIPELINE ERROR]", err);

            FrameService.renderError(
                iframe,
                err
            );

            FrameService.updateTitle(
                frameId,
                file
            );
        }
    }
};
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
	  async load(frameId, file) {
			return DocumentPipeline.load(
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
			const frameId = frame[0];

			const file =
				lastOpened[frameId] ||
				DEFAULT_FILES[frameId];

			console.log("[DOCUMENT RESTORE LAST]", {
				frameId,
				file
			});

			EventBus.emit(
				"document:load",
				{
					frameId,
					file
				}
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

const TemplateService = {
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
