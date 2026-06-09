import {
   
	UIState
} from "./state.js";
import {
   
    FrameService
} from "./rendering.js";
import {
    EventBus
} from "./event-bus.js";
import {
    
    EVENTS
} from "./events.js";
import {
    DocumentSession
} from "./documents.js";
import {
    ConfigService
} from "./config.js";
import { DOM } from "./dom.js";
export const UIService = {
    getHighlightScheme(key) {
        return (
            ConfigService.getHighlightSchemes()[key] ||
            ConfigService.getHighlightSchemes().blue
        );
    },
};
const LayoutModes = {

    order: [4, 3, 2, 1],

    next(current) {

        const index =
            this.order.indexOf(
                current
            );

        if (index === -1) {
            return 4;
        }

        return this.order[
            (index + 1) %
            this.order.length
        ];
    }
};

export const LayoutService = {

    order: [4, 3, 2, 1],

    config: {
        4: {
            className: "four-panel",
            buttonText: "Switch to 3 Panel Mode"
        },

        3: {
            className: "three-panel",
            buttonText: "Switch to 2 Panel Mode"
        },

        2: {
            className: "two-panel",
            buttonText: "Switch to 1 Panel Mode"
        },

        1: {
            className: "one-panel",
            buttonText: "Switch to 4 Panel Mode"
        }
    },

    next(current) {
        const index =
            this.order.indexOf(current);

        if (index === -1) {
            return 4;
        }

        return this.order[
            (index + 1) % this.order.length
        ];
    },

    apply() {
        const layoutMode =
            UIState.get("layoutMode");

        const toggleButton =
            DOM.get("layoutToggle");

        document.body.classList.remove(
            "four-panel",
            "three-panel",
            "two-panel",
            "one-panel"
        );

        const current =
            this.config[layoutMode] ||
            this.config[4];

        document.body.classList.add(
            current.className
        );

        if (toggleButton) {
            toggleButton.textContent =
                current.buttonText;
        }
    },

    init() {
        const toggleButton =
            DOM.get("layoutToggle");

        if (!toggleButton) {
            return;
        }

        toggleButton.addEventListener(
            "click",
            () => {
                UIState.set(
                    "layoutMode",
                    this.next(
                        UIState.get("layoutMode")
                    )
                );
            }
        );
    }
};
export const FontService = {

    getSelector() {
        return DOM.get("fontSelector");
    },

    init() {
        const selector = this.getSelector();

        if (!selector) {
            console.warn("[FONT SERVICE] fontSelector not found");
            return;
        }

        selector.value = String(UIState.getFontSize());

        selector.addEventListener("change", () => {
            const size = Number(selector.value);

            UIState.setFontSize(size);
            FrameService.reloadAll();
        });
    },

    apply() {
		const selector = this.getSelector();

		if (selector) {
			selector.value = String(UIState.getFontSize());
		}
	}
};
export const HighlightService = {

    getSelector() {
        return DOM.get("highlightSelector");
    },

    init() {
        const selector = this.getSelector();

        if (!selector) {
            console.warn("[HIGHLIGHT SERVICE] highlightSelector not found");
            return;
        }

        selector.value = UIState.getHighlightScheme();

        selector.addEventListener("change", () => {
            const scheme = selector.value;

            UIState.setHighlightScheme(scheme);
            FrameService.reloadAll();
        });
    },

    apply() {
        const selector = this.getSelector();

        if (selector) {
            selector.value = UIState.getHighlightScheme();
        }
    }
};
export const VisibilityService = {

    apply(key) {

        const classMap = {
            hideSearch: "hide-search",
            hideGo: "hide-go",
            hideControls: "hide-controls"
        };

        const className =
            classMap[key];

        if (!className) {
            return;
        }

        document.body.classList.toggle(
            className,
            UIState.get(key)
        );
    },

    toggle(key) {
        UIState.set(
            key,
            !UIState.get(key)
        );
    },

	   init() {
		const toggleSearch =
			DOM.get(
				"toggleSearch"
			);

		const toggleGo =
			DOM.get(
				"toggleGo"
			);

		const toggleControls =
			DOM.get(
				"toggleControls"
			);

		toggleSearch?.addEventListener(
			"click",
			() => this.toggle("hideSearch")
		);

		toggleGo?.addEventListener(
			"click",
			() => this.toggle("hideGo")
		);

		toggleControls?.addEventListener(
			"click",
			() => this.toggle("hideControls")
		);
	}
};
