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
	UIState,
	APP
} from "./state.js";
import {
    AppStorage
    
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
    PersistenceService
} from "./documents.js";

import {
    DocumentLoadRequest
} from "./document-load-request.js";
import {
    registerEventBusHandlers,
 
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
		const savedSettings =
			AppStorage.settings.load(APP.state.ui);

		const lastOpened =
			AppStorage.lastOpened.load(APP.state.app.lastOpened);

		StateManager.hydrate({
			ui: savedSettings,
			app: {
				lastOpened
			}
		});

		UIState.hydrate(savedSettings);

		UIState.init();

		LayoutService.init();
		FontService.init();
		HighlightService.init();
		VisibilityService.init();

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
