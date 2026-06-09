import {
    ConfigValidator,
    AppConfig
} from "./modules/config.js";

import {
    NavigationService,
} from "./navigationp20c.js";

import {
    StateManager,
	APP,
	UIState,
	AppState
} from "./modules/state.js";
import {
    AppStorage,
    PersistenceService
} from "./storage.js";
import {
    LayoutService,
    FontService,
    HighlightService,
    VisibilityService,
    UIService
} from "./uip20.js";
import {
    TemplateService,
    DocumentService,
    DocumentLoadRequest
} from "./documentsp20.js";
import {
    registerEventBusHandlers,
    EVENTS
} from "./eventsp19.js";
import {
    EventBus,
    Router
} from "./routerp19.js";
import {
    FrameRegistry,
    FrameService
} from "./renderingp20c.js";
import {
    SearchBindingsService,
    SearchService
} from "./searchp5.js";
import {
    ScrollTrackingService
} from "./scrollp20c.js";
import {
    KeyboardShortcutService
} from "./shortcuts.js";

const AppInitializer = {
    async init() {
        console.log("APP INIT");
		ConfigValidator.validate();
        StateManager.hydrate();

        UIState.init();

        LayoutService.init();
        FontService.init();
        HighlightService.init();
        VisibilityService.init();

        UIState.hydrate();

        await TemplateService.ensure();

        NavigationService.buildNavigation();

        registerEventBusHandlers();

        Router.init();

        NavigationService.setupTreeToggle();

        SearchBindingsService.init();
		KeyboardShortcutService.init();
        ScrollTrackingService.init();

        DocumentService.restoreLast();
    }
};


// ======================================
// APP STARTUP
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        AppInitializer.init();
    }
);
