import {
    ConfigValidator,
    AppConfig,
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";
import {
    LAST_OPENED_KEY,
    SCROLL_STORE_KEY
} from "./storage.js";
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
    UIService,
    OfflineStatusService
} from "./ui.js";
import {
    TemplateService
} from "./template-service.js";
import {
    DocumentService
} from "./document-service.js";
import {
    
    PersistenceService
} from "./document-session.js";
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

// ======================================
// SERVICE WORKER REGISTRATION
// PHASE 27C
// ======================================

function registerServiceWorker() {
    if(!("serviceWorker" in navigator)){
        console.warn(
            "[ServiceWorker] Not supported."
        );
        return;
    }

    window.addEventListener(
        "load",
        () => {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then(registration => {
                    console.log(
                        "[ServiceWorker] Registered:",
                        registration.scope
                    );
                })
                .catch(error => {
                    console.error(
                        "[ServiceWorker] Registration failed:",
                        error
                    );
                });
        }
    );
}



const AppInitializer = {
    async init() {
		registerServiceWorker();
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
		OfflineStatusService.init();

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
