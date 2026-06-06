// ======================================
// EVENT BUS HANDLERS
// ======================================

function registerEventBusHandlers() {
    EventBus.on(
        "document:load",
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
        "documents:reloadAll",
        () => {
            DocumentService.reloadAll();
        }
    );
}
