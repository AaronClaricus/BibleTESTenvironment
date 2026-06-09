import { AppStorage } from "./storage.js";
import {
    LayoutService,
	FontService,
	HighlightService,
	VisibilityService
} from "./ui.js";
import {
    LAST_OPENED_KEY
} from "./constants.js";
export const APP = {
    state: {
        app: {
            currentFiles: {},
            lastOpened: {}
        },
        ui: {
            layoutMode: "four",
            fontSize: 18,
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
export const StateManager = {
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
    set(path, value) {
		const keys = path.split(".");
		const last = keys.pop();

		const target = keys.reduce(
			(obj, key) => {
				if (!obj[key]) {
					obj[key] = {};
				}

				return obj[key];
			},
			this.state
		);

		target[last] = value;
		this.notify(path, value);
	},
	hydrate(initialState = {}) {
		this.state = {
			...APP.state,

			app: {
				...APP.state.app,
				...(initialState.app || {})
			},

			ui: {
				...APP.state.ui,
				...(initialState.ui || {})
			},

			searchState: {
				...APP.state.searchState,
				...(initialState.searchState || {})
			},

			scrollStore: {
				...APP.state.scrollStore,
				...(initialState.scrollStore || {})
			},

			templateHTML:
				initialState.templateHTML ?? APP.state.templateHTML
		};
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


export const UIState = {
    key: "settings",
    state: null,
    init(){

},
    hydrate(savedSettings = {}) {
		StateManager.state.ui = {
			...APP.state.ui,
			...savedSettings
		};

		Object.entries(StateManager.state.ui).forEach(
			([key, value]) => {
				this.applySideEffects(key, value);
			}
		);
	},
    get(key) {
		return StateManager.get(`ui.${key}`);
	},
    set(key, value) {
		StateManager.set(`ui.${key}`, value);

		AppStorage.settings.save(
			StateManager.get("ui")
		);

		this.applySideEffects(key, value);
	},
	getFontSize() {
		const size = Number(this.get("fontSize"));
		return Number.isFinite(size) ? size : 18;
	},

	setFontSize(size) {
		const cleanSize = Number(size);
		this.set(
			"fontSize",
			Number.isFinite(cleanSize) ? cleanSize : 18
		);
	},

	getHighlightScheme() {
		return this.get("highlightScheme") ?? "blue";
	},

	setHighlightScheme(scheme) {
		this.set("highlightScheme", scheme);
	},
    applySideEffects(key, value) {
		switch (key) {

			case "fontSize":
			FontService.apply();
			break;

			case "layoutMode":
			LayoutService.apply();
			break;

			case "highlightScheme":
			HighlightService.apply();
			break;

			case "hideSearch":
			case "hideGo":
			case "hideControls":
				VisibilityService.apply(key);
				break;
		}
	}
};
export const AppState = {
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
