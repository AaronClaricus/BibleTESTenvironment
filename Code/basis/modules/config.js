// ======================================
// CONFIG
// ======================================
export const CONFIG = {
	scroll: {
	maxHistory: 500,
	debounce: 100,
	restoreDelay: 0
	},
	search: {
		scrollOffset: 100
	},
	cache: {
		maxFiles: 20
	},
	storage: {
		fontSizeKey: "fontSize",
		highlightKey: "highlightScheme",
		searchKey: "hideSearch",
		goKey: "hideGo",
		controlsKey: "hideControls"
	}
};
// ======================================
// FRAMES
// =====================================
export const FRAMES = [
	["frameB", "Left"],
	["frameC", "Center"],
	["frameD", "Right"],
	["frameE", "Far Right"]
];
export const FRAME_TITLES = {
	frameB: "titleB",
	frameC: "titleC",
	frameD: "titleD",
	frameE: "titleE"
};
export const highlightSchemes = {
    blue: {
        bg: "#141414",
        text: "#0066ff"
    },
    yellow: {
        bg: "#141414",
        text: "#ffd54f"
    },
    green: {
        bg: "#141414",
        text: "#008529"
    },
    orange: {
        bg: "#141414",
        text: "#c45f00"
    },
    purple: {
        bg: "#141414",
        text: "#7b1fa2"
    },
    lightgreen: {
        bg: "#141414",
        text: "#00ff99"
    }
};

export const ConfigService = {

    get(path, fallback = undefined) {
        if (!path) {
            return fallback;
        }

        const parts = path.split(".");
        let current = AppConfig;

        for (const part of parts) {
            if (
                current === undefined ||
                current === null ||
                !Object.prototype.hasOwnProperty.call(current, part)
            ) {
                return fallback;
            }

            current = current[part];
        }

        return current;
    },

    getFrames() {
        return AppConfig.frames || [];
    },

    getFrameTitles() {
        return AppConfig.frameTitles || {};
    },

    getHighlightSchemes() {
        return AppConfig.highlightSchemes || {};
    },

    getDefaultFiles() {
        return AppConfig.defaultFiles || {};
    }
};
export const ConfigValidator = {

    validate() {
        const required = [
            ["frames", AppConfig.frames],
            ["frameTitles", AppConfig.frameTitles],
            ["highlightSchemes", AppConfig.highlightSchemes],
            ["defaultFiles", AppConfig.defaultFiles],
            ["config", AppConfig.config]
        ];

        let valid = true;

        required.forEach(([name, value]) => {
            if (!value) {
                console.error("[CONFIG VALIDATOR] Missing:", name);
                valid = false;
            }
        });

        if (!Array.isArray(AppConfig.frames)) {
            console.error("[CONFIG VALIDATOR] frames must be an array");
            valid = false;
        }

        console.log("[CONFIG VALIDATOR]", {
            valid,
            frames: AppConfig.frames?.length || 0,
            defaultFiles: Object.keys(AppConfig.defaultFiles || {}).length
        });

        return valid;
    }
};

export const DocumentPipelineDebug = {

    enabled: false,

    log(label, data = {}) {
        if (!this.enabled) {
            return;
        }

        console.log(label, data);
    },

    warn(label, data = {}) {
        if (!this.enabled) {
            return;
        }

        console.warn(label, data);
    },

    error(label, data = {}) {
        console.error(label, data);
    },

    enable() {
        this.enabled = true;
        console.log("[DOCUMENT PIPELINE DEBUG ENABLED]");
    },

    disable() {
        this.enabled = false;
        console.log("[DOCUMENT PIPELINE DEBUG DISABLED]");
    }
};
export const DEFAULT_FILES = {
    frameB: "./WEB/Gospel/Matthew",
    frameC: "./WEB/Gospel/John",
    frameD: "./WEB/Epistles/Romans",
    frameE: "./WEB/Prophets/Revelation"
};
export const AppConfig = {
    config: CONFIG,
    frames: FRAMES,
    frameTitles: FRAME_TITLES,
    highlightSchemes: highlightSchemes,
    defaultFiles: DEFAULT_FILES
};

