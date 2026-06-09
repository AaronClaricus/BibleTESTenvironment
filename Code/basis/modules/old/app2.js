

const AppInitializer = {
    async init() {
        console.log("APP INIT");

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
