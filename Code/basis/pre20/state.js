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
            layoutMode: "four",
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
		const savedSettings =
			AppStorage.settings.load();

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

