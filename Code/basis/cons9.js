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

		layoutModeKey: "layoutMode",

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

        currentFiles: {},

        fileCache: {},

        cacheOrder: [],

        searchState: {},

        scrollStore: {},

        lastOpened: {},

        templateHTML: "",

        settings: {

            layoutMode: 4,

            fontSize: "12px",

            highlightScheme: "blue",

            hideSearch: false,

            hideGo: false,

            hideControls: false

        }

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
const FONT_SIZE_KEY =
	CONFIG.storage.fontSizeKey;
const HIGHLIGHT_KEY =
	CONFIG.storage.highlightKey;
// ==============================
// FONT SIZE CONTROL
// ==============================
const fontSelector =
    document.getElementById(
        "fontSelector"
    );


// ==============================
// LAYOUT STORAGE
// ==============================
const LAYOUT_MODE_KEY =
	CONFIG.storage.layoutModeKey;
// current mode
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

	// ======================================
	// END GLOBAL VARIABLES
	// ======================================

