// ======================================
// BEGIN GLOBAL VARIABLES
// ======================================

const toggleSearch =
    document.getElementById(
        "toggleSearch"
    );


const toggleGo =
    document.getElementById("toggleGo");

const highlightSchemes = {
    blue: {
        bg: "#141414",
        text: "#0066ff"
    },
    yellow: {
        bg: "#141414",
        text: "#ffd54f"
    },
    green: {
        bg: "#141414",
        text: "#008529"
    },
    orange: {
        bg: "#141414",
        text: "#c45f00"
    },
    purple: {
        bg: "#141414",
        text: "#7b1fa2"
    },
    lightgreen: {
        bg: "#141414",
        text: "#00ff99"
    }
};
// ==============================
// TRACKING STORAGE
// ==============================


// ==============================
// FILE CACHE
// ==============================

// max cached files
const MAX_CACHE = 500;
// tracks cache order

// ==============================
// SCROLL STATE STORAGE
// ==============================
const SCROLL_STORE_KEY =
    "scroll-state";
const LAST_OPENED_KEY =
    "last-opened-files";
// max saved files PER FRAME
const MAX_SCROLL_HISTORY = 500;

// ======================================
// CONFIG
// ======================================

const CONFIG = {

	scroll: {

	maxHistory: 500,

	debounce: 100,

	restoreDelay: 0

	},

	search: {

		scrollOffset: 100

	},
	cache: {

		maxFiles: 20

	},

	storage: {

		fontSizeKey: "fontSize",

		highlightKey: "highlightScheme",


		searchKey: "hideSearch",

		goKey: "hideGo",

		controlsKey: "hideControls"

	}

};
// ======================================
// FRAMES
// ======================================

const FRAMES = [

	["frameB", "Left"],

	["frameC", "Center"],

	["frameD", "Right"],

	["frameE", "Far Right"]

];
const FRAME_TITLES = {

	frameB: "titleB",

	frameC: "titleC",

	frameD: "titleD",

	frameE: "titleE"

};
// ======================================
// APP STATE
// ======================================

const APP = {

    state: {

        app: {
            currentFiles: {},
            lastOpened: {}
        },

        ui: {
            layoutMode: 4,
            fontSize: "12px",
            highlightScheme: "blue",
            hideSearch: false,
            hideGo: false,
            hideControls: false
        },

        searchState: {},
        scrollStore: {},
        templateHTML: null
    }
};
// ======================================
// STORAGE SYSTEM
// ======================================

const AppStorage = {

	// ==============================
	// GENERIC GET
	// ==============================
	get(
		key,
		fallback = null
	){

		try{

			const value =
				localStorage.getItem(key);

			if(value === null){
				return fallback;
			}

			return JSON.parse(value);

		}catch(err){

			console.error(
				"[STORAGE GET ERROR]",
				key,
				err
			);

			return fallback;
		}
	},

	// ==============================
	// GENERIC SET
	// ==============================
	set(
		key,
		value
	){

		try{

			localStorage.setItem(
				key,
				JSON.stringify(value)
			);

		}catch(err){

			console.error(
				"[STORAGE SET ERROR]",
				key,
				err
			);
		}
	},

	// ==============================
	// REMOVE
	// ==============================
	remove(key){

		try{

			localStorage.removeItem(key);

		}catch(err){

			console.error(
				"[STORAGE REMOVE ERROR]",
				key,
				err
			);
		}
	},

	// ==============================
	// CLEAR
	// ==============================
	clear(){

		try{

			localStorage.clear();

		}catch(err){

			console.error(
				"[STORAGE CLEAR ERROR]",
				err
			);
		}
	},

	// ==============================
	// SETTINGS
	// ==============================
	settings: {

		load(){

			return AppStorage.get(
				"settings",
				{
					layoutMode: 4,
					fontSize: "12px",
					highlightScheme: "default",
					hideSearch: false,
					hideGo: false,
					hideControls: false
				}
			);
		},

		save(settings){

			AppStorage.set(
				"settings",
				settings
			);
		}
	},

	// ==============================
	// LAST OPENED FILES
	// ==============================
	lastOpened: {

		load(){

			return AppStorage.get(
				LAST_OPENED_KEY,
				{}
			);
		},

		save(store){

			AppStorage.set(
				LAST_OPENED_KEY,
				store
			);
		},

		setFile(
			frameId,
			file
		){

			const store =
				this.load();

			store[frameId] =
				file;

			this.save(store);
		}
	},

	// ==============================
	// SCROLL STORE
	// ==============================
	scroll: {

		load(){

			return AppStorage.get(
				SCROLL_STORE_KEY,
				{}
			);
		},

		save(store){

			AppStorage.set(
				SCROLL_STORE_KEY,
				store
			);
		}
	}
};
 // ==============================
// FONT STORAGE
// ==============================

// ==============================
// FONT SIZE CONTROL
// ==============================
const fontSelector =
    document.getElementById(
        "fontSelector"
    );


// ==============================
// RESTORE SAVED LAYOUT
// ==============================


const SEARCH_KEY =
	CONFIG.storage.searchKey;

const GO_KEY =
	CONFIG.storage.goKey;

const CONTROLS_KEY =
	CONFIG.storage.controlsKey;
	const highlightSelector =
    document.getElementById("highlightSelector");

const StateManager = {

    state: APP.state,

    listeners: {},

    get(path) {

        return path
            .split(".")
            .reduce(
                (obj,key)=>obj?.[key],
                this.state
            );
    },

    set(path,value) {

        const keys = path.split(".");
        const last = keys.pop();

        const target =
            keys.reduce(
                (obj,key)=>obj[key],
                this.state
            );

        target[last] = value;

        this.notify(path,value);
    },
	hydrate(){

    const settings =
        AppStorage.settings.load();

    if(settings){

        Object.assign(
            this.state.ui,
            settings
        );
    }

    this.state.app.lastOpened =
        AppStorage.lastOpened.load() || {};
},
    subscribe(path,callback) {

        if(!this.listeners[path]){

            this.listeners[path] = [];

        }

        this.listeners[path].push(callback);
    },

    notify(path,value){

        const listeners =
            this.listeners[path] || [];

        listeners.forEach(
            fn => fn(value)
        );
    }
};
// ==============================
// TEMPLATE CACHE
// ==============================
const UIState = {
    key: "settings",
    state: null,

    init(){

},

    hydrate() {
        // IMPORTANT: apply ALL UI side effects at startup
        this.applySideEffects("fontSize", StateManager.state.ui.fontSize);
        this.applySideEffects("layoutMode", StateManager.state.ui.layoutMode);
        this.applySideEffects("highlightScheme", StateManager.state.ui.highlightScheme);
        this.applySideEffects("hideSearch", StateManager.state.ui.hideSearch);
        this.applySideEffects("hideGo", StateManager.state.ui.hideGo);
        this.applySideEffects("hideControls", StateManager.state.ui.hideControls);
    },

    get(key) {
        return StateManager.state.ui?.[key];
    },

    set(key, value) {
        StateManager.state.ui[key] = value;
        AppStorage.set(this.key, StateManager.state.ui);
        this.applySideEffects(key, value);
    },

    applySideEffects(key, value) {
        switch (key) {

            case "fontSize":
                document.documentElement.style.setProperty("--font-size", value);
                break;

            case "layoutMode":
				applyLayoutMode();
			break;

            case "highlightScheme":
				DocumentService.reloadAll();
			break;

            case "hideSearch":
                document.body.classList.toggle("hide-search", value);
                break;

            case "hideGo":
                document.body.classList.toggle("hide-go", value);
                break;

            case "hideControls":
                document.body.classList.toggle("hide-controls", value);
                break;
        }
    }
};
const UIService = {
    getHighlightScheme(key) {
        return highlightSchemes[key] || {
            bg: "#000",
            text: "#fff"
        };
    }
};
const AppState = {

    getCurrentFile(frameId){

        return StateManager.get(
            `app.currentFiles.${frameId}`
        );
    },

    setCurrentFile(
        frameId,
        file
    ){

        StateManager.set(
            `app.currentFiles.${frameId}`,
            file
        );
    },

    getLastOpened(){

        return StateManager.get(
            "app.lastOpened"
        );
    },

    setLastOpened(store){

        StateManager.set(
            "app.lastOpened",
            store
        );
    }
};
const PersistenceService = {

    saveLastOpened(
        frameId,
        file
    ) {

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
	// ======================================
	// END GLOBAL VARIABLES
	// ======================================
	// ======================================
	// Services
	// ======================================
const ScrollService = {

    load() {

        return AppStorage.scroll.load();

    },

    save(store) {

        AppStorage.scroll.save(store);

    },

    restore(frameId, iframe) {

       const file =
		DocumentService.getActive(
			frameId
		);

        if (!file) {

            console.log(
                "[RESTORE BLOCKED]",
                frameId
            );

            return;
        }

        const store =
            this.load();

        const entry =
            store?.[frameId]?.[file];

        if (!entry) {

            console.log(
                "[RESTORE SKIPPED]",
                file
            );

            return;
        }

        const scrollY =
            Number(entry.y);

        if (isNaN(scrollY)) {

            console.log(
                "[RESTORE FAILED]",
                file
            );

            return;
        }

        const iframeWindow =
            iframe.contentWindow;

        setTimeout(() => {

            iframeWindow.scrollTo(
                0,
                scrollY
            );

            console.log(
                "[RESTORED]",
                frameId,
                file,
                scrollY
            );

        },
        CONFIG.scroll.restoreDelay);
    },

    attach(frameId) {

        const iframe =
            document.getElementById(frameId);

        if (!iframe) {
            return;
        }

        iframe.onload = () => {

            console.log(
                frameId + " LOADED"
            );

            const iframeWindow =
                iframe.contentWindow;

            let scrollTimeout;

            iframeWindow.onscroll = () => {

                clearTimeout(
                    scrollTimeout
                );

                scrollTimeout =
                    setTimeout(() => {

                        const file =
						DocumentService.getActive(
							frameId
						);

                        if (!file) {
                            return;
                        }

                        const store =
                            this.load();

                        if (!store[frameId]) {

                            store[frameId] = {};

                        }

                        store[frameId][file] = {

                            y:
                                iframeWindow.scrollY,

                            time:
                                Date.now()

                        };

                        const entries =
                            Object.entries(
                                store[frameId]
                            );

                        if (
                            entries.length >
                            CONFIG.scroll.maxHistory
                        ) {

                            entries.sort(
                                (a, b) =>
                                    b[1].time -
                                    a[1].time
                            );

                            store[frameId] =
                                Object.fromEntries(
                                    entries.slice(
                                        0,
                                        CONFIG.scroll.maxHistory
                                    )
                                );
                        }

                        this.save(store);

                    },
                    CONFIG.scroll.debounce);

            };

            this.restore(
                frameId,
                iframe
            );

			FrameService.updateTitle(
				frameId,
				DocumentService.getActive(
					frameId
				)
			);
        };
    }
};
const NavigationService = {

	buildNavigation() {
		buildNavigation("navA", NAVIGATION);
    },
    setupClickRouter() {

        document.addEventListener(
            "click",
            e => {

                // ==============================
                // NAV TREE TOGGLE
                // ==============================
                const toggle =
                    e.target.closest(
                        ".toggle"
                    );

                if(toggle){

                    const nested =
                        toggle.parentElement.querySelector(
                            ":scope > .nested"
                        );

                    if(!nested){
                        return;
                    }

                    if(
                        nested.classList.contains(
                            "open"
                        )
                    ){

                        nested.classList.remove(
                            "open"
                        );

                        toggle.textContent =
                            toggle.textContent.replace(
                                "▼",
                                "▶"
                            );

                    }
                    else{

                        nested.classList.add(
                            "open"
                        );

                        toggle.textContent =
                            toggle.textContent.replace(
                                "▶",
                                "▼"
                            );
                    }

                    return;
                }

                // ==============================
                // FILE LINKS
                // ==============================
                const fileLink =
                    e.target.closest(
                        ".file-link"
                    );

                if(fileLink){

                    const frame =
                        document.getElementById(
                            fileLink.dataset.frame
                        );

                    if(!frame){
                        return;
                    }

                    frame.src =
                        fileLink.dataset.file +
                        ".html";

                    loadTextFile(
                        fileLink.dataset.frame,
                        fileLink.dataset.file
                    );

                    return;
                }
            }
        );
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
// ======================================
// HTML RENDERER
// ======================================

const HTMLRenderer = {

    build(
        text,
        scheme
    ) {

        const template =
            APP.state.templateHTML || "";

        const size =
            getComputedStyle(
                document.documentElement
            ).getPropertyValue(
                "--font-size"
            );

        const content =
            text && text.trim()
                ? this.escape(text)
                : `
                    <div style="
                        border:2px dashed #666;
                        padding:1em;
                        color:#aaa;
                    ">
                        EMPTY FRAME
                    </div>
                `;

        return template
            .replaceAll(
                "__FONT_SIZE__",
                size
            )
            .replaceAll(
                "__HIGHLIGHT_BG__",
                scheme.bg
            )
            .replaceAll(
                "__HIGHLIGHT_TEXT__",
                scheme.text
            )
            .replace(
                "__CONTENT__",
                content
            );
    },

    escape(str) {

        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
};
const FrameService = {

    render(iframe, text, scheme) {

        console.log("[RENDER CHECK]", {
            hasTemplate: !!APP.state.templateHTML,
            templateLength: APP.state.templateHTML?.length,
            textLength: text?.length
        });

        iframe.srcdoc =
			HTMLRenderer.build(
				text,
				scheme
		);
    },

    renderError(iframe, err) {

		console.error(err);

		iframe.srcdoc =
			HTMLRenderer.build(
				"ERROR",
				{
					bg: "#400",
					text: "#fff"
				}
			);
	},

    updateTitle(
        frameId,
        filePath
    ) {

        const titleBar =
            document.getElementById(
                FRAME_TITLES[frameId]
            );

        if(!titleBar){
            return;
        }

        if(!filePath){

            titleBar.textContent =
                "No File";

            return;
        }

        const fileName =
            filePath.split("/")
                .pop();

        titleBar.textContent =
            fileName;
    },

	 reloadAll() {

        return DocumentService.reloadAll();

    }
};
// ======================================
// DOCUMENT SERVICE
// ======================================

const DocumentService = {

    async load(
        frameId,
        file
    ) {

        const iframe =
            document.getElementById(
                frameId
            );

        if (!iframe) {
            return;
        }

        try {

            this.setActive(
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
                "[DOCUMENT LOAD]",
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

        }
        catch (err) {

            FrameService.renderError(
                iframe,
                err
            );
        }
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
            this.getActive(
                frameId
            );

        if (!file) {
            return;
        }

        return this.load(
            frameId,
            file
        );
    },

    // ------------------
    // RELOAD ALL DOCUMENTS
    // ------------------

    reloadAll() {

        console.log(
            "[DOCUMENT RELOAD ALL]"
        );

        FRAMES.forEach(frame => {

            const frameId =
                frame[0];

            this.reload(
                frameId
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




const SearchEngine = {
    findMatches(doc, term) {
        const escaped = term.replace(/[.*?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "gi");

        const textNodes = [];
        collectTextNodes(doc.body, textNodes, regex);

        return textNodes;
    }
};










const SearchHighlighter = {
    apply(doc, regex) {
        removeHighlights(doc);
        highlightText(doc.body, regex, doc);
        return [...doc.querySelectorAll("mark")];
    },

    clear(doc) {
        removeHighlights(doc);
    }
};
// ======================================
// SEARCH SERVICE
// ======================================

const SearchService = {

    query(
        iframe,
        term
    ) {

        if (!iframe || !term) {
            return [];
        }

        const doc =
            iframe.contentDocument ||
            iframe.contentWindow.document;

        const regex =
            this.createRegex(
                term
            );

        return this.highlight(
            doc,
            regex
        );
    },

    highlight(
        doc,
        regex
    ) {

        return SearchHighlighter.apply(
            doc,
            regex
        );
    },

    clear(doc) {

        return SearchHighlighter.clear(
            doc
        );
    },

    createRegex(term) {

        return new RegExp(
            term.replace(
                /[.*?^${}()|[\]\\]/g,
                "\\$&"
            ),
            "gi"
        );
    }
};

// ======================================
// SEARCH CONTROLLER
// ======================================

const SearchController = {

    create({
        input,
        button,
        iframe,
        counter
    }) {
		
		if (
			!input ||
			!button ||
			!iframe ||
			!counter
		) {
			console.warn(
				"[SEARCH BIND SKIPPED]",
				{
					input,
					button,
					iframe,
					counter
				}
			);

			return;
		}
        const state = {
            matches: [],
            index: -1,
            lastTerm: ""
        };

        function updateCounter() {

            counter.textContent =
                state.matches.length === 0
                    ? "0/0"
                    : `${state.index + 1}/${state.matches.length}`;
        }

        function scrollToMatch(match) {

            const win =
                iframe.contentWindow;

            const rect =
                match.getBoundingClientRect();

            win.scrollTo({
                top:
                    win.scrollY +
                    rect.top -
                    CONFIG.search.scrollOffset,
                behavior: "auto"
            });
        }

        function resetSearch(term) {

            state.lastTerm =
                term;

            state.matches =
                SearchService.query(
                    iframe,
                    term
                );

            state.index =
                -1;
        }

        function advanceMatch() {

            if (!state.matches.length) {
                updateCounter();
                return;
            }

            state.index =
                (state.index + 1) %
                state.matches.length;

            scrollToMatch(
                state.matches[state.index]
            );

            updateCounter();
        }

        function runSearch() {

            const term =
                input.value.trim();

            if (!term) {
                return;
            }

            if (state.lastTerm !== term) {

                resetSearch(
                    term
                );
            }

            advanceMatch();
        }

        button.addEventListener(
            "click",
            runSearch
        );

        input.addEventListener(
            "keydown",
            e => {

                if (e.key === "Enter") {

                    runSearch();

                }
            }
        );
    }
};
const selected = highlightSelector?.value;
const scheme = UIService.getHighlightScheme(selected);
