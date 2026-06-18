export const DOM = {
	 offlineStatus() {
        return document.getElementById(
            "offlineStatus"
        );
    },
    cache: {},

    get(id) {
        if (!this.cache[id]) {
            this.cache[id] = document.getElementById(id);
        }

        return this.cache[id];
    },

    query(selector) {
        return document.querySelector(selector);
    },

    queryAll(selector) {
        return [...document.querySelectorAll(selector)];
    },

    clear() {
        this.cache = {};
    }
};
