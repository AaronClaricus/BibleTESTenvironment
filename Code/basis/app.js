import {
    ConfigValidator,
    AppConfig,
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";
import {
    LAST_OPENED_KEY,
    SCROLL_STORE_KEY
} from "./constants.js";
import {
    NavigationService,
} from "./navigation.js";

import {
    StateManager,
	UIState
} from "./state.js";
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
} from "./ui.js";
import {
    TemplateService,
    DocumentService,
    DocumentLoadRequest
} from "./documents.js";
import {
    registerEventBusHandlers,
    EVENTS
} from "./events.js";
import {
    Router
} from "./router.js";
import {
    EventBus
} from "./event-bus.js";
import {
    FrameRegistry,
    FrameService
} from "./rendering.js";
import {
    SearchBindingsService,
    SearchService
} from "./search.js";
import {
    ScrollTrackingService
} from "./scroll.js";
import {
    KeyboardShortcutService
} from "./shortcuts.js";
import { DOM } from "./dom.js";
const AppInitializer = {
    async init() {
        console.log("APP INIT");
		ConfigValidator.validate();
		DOM.clear();
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
