
export const EventBus = {
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
    },

    clear() {
        this.events = {};
    }
};
