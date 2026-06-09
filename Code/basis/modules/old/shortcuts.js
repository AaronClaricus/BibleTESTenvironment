const KeyboardShortcutService = {
    activeFrameId: "frameB",

    init() {
        document.addEventListener(
            "keydown",
            e => this.handleKeydown(e)
        );

        document.addEventListener(
            "focusin",
            e => this.trackFocus(e)
        );

        this.bindIframeFocus();
    },

    bindIframeFocus() {
        FRAMES.forEach(([frameId]) => {
            const iframe = document.getElementById(frameId);

            if (!iframe) {
                return;
            }

            iframe.addEventListener("load", () => {
                try {
                    iframe.contentDocument.addEventListener(
                        "keydown",
                        e => this.handleKeydown(e, frameId)
                    );

                    iframe.contentDocument.addEventListener(
                        "click",
                        () => {
                            this.activeFrameId = frameId;
                        }
                    );
                }
                catch (err) {
                    console.warn("[SHORTCUTS] iframe bind failed", frameId, err);
                }
            });
        });
    },

    trackFocus(e) {
        const row = e.target.closest?.(".search-row");

        if (!row) {
            return;
        }

        const iframe = row.parentElement.querySelector("iframe");

        if (iframe?.id) {
            this.activeFrameId = iframe.id;
        }
    },

    isTypingTarget(target) {
        return (
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            )
        );
    },

    handleKeydown(e, frameId = null) {
        const key = e.key.toLowerCase();
		const code = e.code;
        if (frameId) {
            this.activeFrameId = frameId;
        }

        if (this.isTypingTarget(e.target)) {
            if (key === "escape") {
                e.preventDefault();
                e.target.blur();
            }

            return;
        }
		
        switch (key) {
			case "s":
				e.preventDefault();

				document
					.getElementById("toggleSearch")
					?.click();

				break;

			case "h":
				e.preventDefault();

				document
					.getElementById("toggleControls")
					?.click();

				break;
            case "f":
                e.preventDefault();
                this.focusSearch();
                break;

            case "n":
                e.preventDefault();
                this.clickGo();
                break;

          case "1":
				if (e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
					return;
				}

				e.preventDefault();
				UIState.set("layoutMode", 1);
				break;

			case "2":
				if (e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
					return;
				}

				e.preventDefault();
				UIState.set("layoutMode", 2);
				break;

			case "3":
				if (e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
					return;
				}

				e.preventDefault();
				UIState.set("layoutMode", 3);
				break;

			case "4":
				if (e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) {
					return;
				}

				e.preventDefault();
				UIState.set("layoutMode", 4);
				break;

            case "/":
                e.preventDefault();
                this.focusSearch();
                break;
        }
    },

    getActiveSearchInput() {
        const map = {
            frameB: "search",
            frameC: "searchC",
            frameD: "searchD",
            frameE: "searchE"
        };

        return document.getElementById(
            map[this.activeFrameId] || "search"
        );
    },

    getActiveGoButton() {
        const map = {
            frameB: "go",
            frameC: "goC",
            frameD: "goD",
            frameE: "goE"
        };

        return document.getElementById(
            map[this.activeFrameId] || "go"
        );
    },

    focusSearch() {
        const input = this.getActiveSearchInput();

        if (!input) {
            return;
        }

        input.focus();
        input.select();
    },

    clickGo() {
        const button = this.getActiveGoButton();

        if (button) {
            button.click();
        }
    }
};
