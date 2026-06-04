	// ======================================
	// BEGIN EVENTS LISTENERS
	// ======================================
// ==============================
// LAYOUT MODE BUTTON
// cycles:
// 4 panel -> 3 panel -> 2 panel -> 1 panel
// ==============================
const toggleButton =
    document.getElementById("layoutToggle");






	



	// ======================================
	// END GENERAL FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL EXECUTION
	// ======================================
document.addEventListener("DOMContentLoaded", () => {
    init();
});
async function init(){

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
    ScrollTrackingService.init();

    DocumentService.restoreLast();

}



	// ======================================
	// END GENERAL EXECUTION
	// ======================================
