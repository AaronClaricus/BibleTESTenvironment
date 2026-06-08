
const UIService = {
    getHighlightScheme(key) {
        return highlightSchemes[key] || {
            bg: "#000",
            text: "#fff"
        };
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

const LayoutService = {

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
            document.getElementById("layoutToggle");

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
            document.getElementById("layoutToggle");

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
const FontService = {

    apply() {
        const fontSize =
            UIState.get("fontSize");

        document.documentElement.style.setProperty(
            "--font-size",
            fontSize
        );

        if (fontSelector) {
            fontSelector.value =
                fontSize;
        }

        EventBus.emit(EVENTS.DOCUMENTS_RELOAD_ALL);
    },

    init() {
        if (!fontSelector) {
            return;
        }

        fontSelector.addEventListener(
            "change",
            () => {
                UIState.set(
                    "fontSize",
                    fontSelector.value
                );
            }
        );
    }
};
const HighlightService = {

    apply() {
        const highlightScheme =
            UIState.get("highlightScheme");

        if (highlightSelector) {
            highlightSelector.value =
                highlightScheme;
        }

        EventBus.emit(
            "documents:reloadAll"
        );
    },

    init() {
        if (!highlightSelector) {
            return;
        }

        highlightSelector.addEventListener(
            "change",
            () => {
                UIState.set(
                    "highlightScheme",
                    highlightSelector.value
                );
            }
        );
    }
};
const VisibilityService = {

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
			document.getElementById(
				"toggleSearch"
			);

		const toggleGo =
			document.getElementById(
				"toggleGo"
			);

		const toggleControls =
			document.getElementById(
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
