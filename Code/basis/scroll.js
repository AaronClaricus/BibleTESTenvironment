import {
    FrameRegistry
} from "./rendering.js";
import {
    DocumentService
} from "./document-service.js";
import {
    AppStorage
} from "./storage.js";
import {
    FrameService
} from "./rendering.js";
import {
   
    SCROLL_STORE_KEY
} from "./storage.js";
import {
    ConfigService,
} from "./config.js";
const ScrollService = {
    load() {
        return AppStorage.scroll.load();
    },
    save(store) {
        AppStorage.scroll.save(store);
    },
    restore(frameId, iframe) {
       const file =
		DocumentService.getActive(
			frameId
		);
        if (!file) {
            console.log(
                "[RESTORE BLOCKED]",
                frameId
            );
            return;
        }
        const store =
            this.load();
        const entry =
            store?.[frameId]?.[file];
        if (!entry) {
            console.log(
                "[RESTORE SKIPPED]",
                file
            );
            return;
        }
        const scrollY =
            Number(entry.y);
        if (isNaN(scrollY)) {
            console.log(
                "[RESTORE FAILED]",
                file
            );
            return;
        }
        const iframeWindow =
            iframe.contentWindow;
        setTimeout(() => {
            iframeWindow.scrollTo(
                0,
                scrollY
            );
            console.log(
                "[RESTORED]",
                frameId,
                file,
                scrollY
            );
        },
        ConfigService.get(
			"config.search.scrollOffset",
			120
		));
    },
    attach(frameId) {
        const iframe =
            FrameRegistry.get(frameId);
        if (!iframe) {
            return;
        }
        iframe.onload = () => {
            console.log(
                frameId + " LOADED"
            );
            const iframeWindow =
                iframe.contentWindow;
            let scrollTimeout;
            iframeWindow.onscroll = () => {
                clearTimeout(
                    scrollTimeout
                );
                scrollTimeout =
                    setTimeout(() => {
                        const file =
						DocumentService.getActive(
							frameId
						);
                        if (!file) {
                            return;
                        }
                        const store =
                            this.load();
                        if (!store[frameId]) {
                            store[frameId] = {};
                        }
                        store[frameId][file] = {
                            y:
                                iframeWindow.scrollY,
                            time:
                                Date.now()
                        };
                        const entries =
                            Object.entries(
                                store[frameId]
                            );
                        if (
                            entries.length >
                            ConfigService.get("config.scroll.maxHistory", 50)
                        ) {
                            entries.sort(
                                (a, b) =>
                                    b[1].time -
                                    a[1].time
                            );
                            store[frameId] =
                                Object.fromEntries(
                                    entries.slice(
                                        0,
                                        ConfigService.get("config.scroll.maxHistory", 50)
                                    )
                                );
                        }
                        this.save(store);
                    },
                    ConfigService.get("config.scroll.debounce", 250));
            };
            this.restore(
                frameId,
                iframe
            );
			FrameService.updateTitle(
				frameId,
				DocumentService.getActive(
					frameId
				)
			);
        };
    }
};


export const ScrollTrackingService = {

    init() {

        ConfigService.getFrames().forEach(
            frame => {

                ScrollService.attach(
                    frame[0]
                );

            }
        );
    }
};
