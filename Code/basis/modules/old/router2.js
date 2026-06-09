
const EventBus = {
    events: {},
    on(eventName, handler) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(handler);
    },
    off(eventName, handler) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] =
            this.events[eventName].filter(
                registeredHandler =>
                    registeredHandler !== handler
            );
    },
    emit(eventName, payload) {
        const handlers =
            this.events[eventName] || [];
        handlers.forEach(handler => {
            try {
                handler(payload);
            }
            catch (err) {
                console.error(
                    `[EVENT BUS ERROR] ${eventName}`,
                    err
                );
            }
        });
    }
};
const Router = {
    init() {
        this.bindDocumentLinks();
    },
    bindDocumentLinks() {
        document.addEventListener(
            "click",
            e => {
                const fileLink =
                    e.target.closest(
                        ".file-link"
                    );
                if (!fileLink) {
                    return;
                }
                e.preventDefault();
                this.openDocumentFromLink(
                    fileLink
                );
            }
        );
    },
    openDocumentFromLink(fileLink) {
        const frameId =
            fileLink.dataset.frame;
        const file =
            fileLink.dataset.file;
        if (!frameId || !file) {
            console.warn(
                "[ROUTER] Missing frame or file",
                {
                    frameId,
                    file
                }
            );
            return;
        }
        this.navigateToDocument(
            frameId,
            file
        );
    },
    navigateToDocument(frameId, file) {
        EventBus.emit(
            "document:load",
            {
                frameId,
                file
            }
        );
    }
};
