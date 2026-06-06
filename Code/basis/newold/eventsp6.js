// ======================================
// EVENT BUS HANDLERS
// ======================================
const EVENTS = {
    DOCUMENT_LOAD: "document:load",
    DOCUMENTS_RELOAD_ALL: "documents:reloadAll",
    SEARCH_NEXT: "search:next",
    SEARCH_PREVIOUS: "search:previous",
    UI_RELOAD_ALL: "ui:reloadAll"
};
function registerEventBusHandlers() {
    EventBus.on(
		EVENTS.DOCUMENT_LOAD,
		payload => {
			DocumentService.load(
				payload.frameId,
				payload.file
			);
		}
	);

    EventBus.on(
        "document:reload",
        payload => {
            if (!payload) {
                return;
            }

            DocumentService.load(
                payload.frameId,
                payload.file
            );
        }
    );

   EventBus.on(
		EVENTS.DOCUMENTS_RELOAD_ALL,
		() => {
			DocumentService.reloadAll();
		}
	);
}
