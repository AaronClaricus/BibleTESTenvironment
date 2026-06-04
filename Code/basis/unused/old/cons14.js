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
        searchState: {},
        scrollStore: {}
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


// ==============================
// TEMPLATE CACHE
// ==============================
const UIState = {
    key: "settings",
    state: null,

    init() {
        this.state = AppStorage.get(this.key, {
            layoutMode: 4,
            fontSize: "12px",
            highlightScheme: "blue",
            hideSearch: false,
            hideGo: false,
            hideControls: false
        });
    },

    hydrate() {
        // IMPORTANT: apply ALL UI side effects at startup
        this.applySideEffects("fontSize", this.state.fontSize);
        this.applySideEffects("layoutMode", this.state.layoutMode);
        this.applySideEffects("highlightScheme", this.state.highlightScheme);
        this.applySideEffects("hideSearch", this.state.hideSearch);
        this.applySideEffects("hideGo", this.state.hideGo);
        this.applySideEffects("hideControls", this.state.hideControls);
    },

    get(key) {
        return this.state?.[key];
    },

    set(key, value) {
        this.state[key] = value;
        AppStorage.set(this.key, this.state);
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
                reloadAllOpenFrames();
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
            StateService.getCurrentFile(frameId);

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
                            StateService.getCurrentFile(
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

            updateIframeTitle(
                frameId,
                StateService.getCurrentFile(
                    frameId
                )
            );
        };
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
const FrameService = {
    render(iframe, text, scheme) {
	    console.log("[RENDER CHECK]", {
        hasTemplate: !!APP.state.templateHTML,
        templateLength: APP.state.templateHTML?.length,
        textLength: text?.length
    });
        iframe.srcdoc = buildTextHTML(text, scheme);
    },

    renderError(iframe, err) {
        console.error(err);
        iframe.srcdoc = buildTextHTML("ERROR", {
            bg: "#400",
            text: "#fff"
        });
    }
};
const StateService = {
    _state: {
        currentFiles: {}
    },

    setCurrentFile(frameId, file) {
        this._state.currentFiles[frameId] = file;
    },

    getCurrentFile(frameId) {
        return this._state.currentFiles[frameId];
    }
};
const PersistenceService = {
    saveLastOpened(frameId, file) {
        AppStorage.lastOpened.setFile(frameId, file);
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


const SearchController = {
    create({ input, button, iframe, counter }) {

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

        function runSearch() {
            const term = input.value.trim();
            if (!term) return;

            const doc = iframe.contentDocument || iframe.contentWindow.document;

            if (state.lastTerm !== term) {
                state.lastTerm = term;

                const regex = new RegExp(
                    term.replace(/[.*?^${}()|[\]\\]/g, "\\$&"),
                    "gi"
                );

                state.matches = SearchHighlighter.apply(doc, regex);
                state.index = -1;
            }

            if (!state.matches.length) {
                updateCounter();
                return;
            }

            state.index = (state.index + 1) % state.matches.length;

            const match = state.matches[state.index];
            const win = iframe.contentWindow;
            const rect = match.getBoundingClientRect();

            win.scrollTo({
                top: win.scrollY + rect.top - CONFIG.search.scrollOffset,
                behavior: "auto"
            });

            updateCounter();
        }

        button.addEventListener("click", runSearch);
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") runSearch();
        });
    }
};
const selected = highlightSelector?.value;
const scheme = UIService.getHighlightScheme(selected);
