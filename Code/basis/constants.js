
import {
    ConfigService,
    DocumentPipelineDebug
} from "./config.js";











const toggleSearch =
    document.getElementById(
        "toggleSearch"
    );
const toggleGo =
    document.getElementById("toggleGo");


// ==============================
// SCROLL STATE STORAGE
// ==============================
export const SCROLL_STORE_KEY =
    "scroll-state";
export const LAST_OPENED_KEY =
    "last-opened-files";
// max saved files PER FRAME
// const MAX_SCROLL_HISTORY = 500;
// const MAX_CACHE = 500;
