const toggleSearch =
    document.getElementById(
        "toggleSearch"
    );
const toggleGo =
    document.getElementById("toggleGo");

// ==============================
// TRACKING STORAGE
// ==============================
// ==============================
// FILE CACHE
// ==============================
// max cached files
const MAX_CACHE = 500;
// tracks cache order
// ==============================
// SCROLL STATE STORAGE
// ==============================
const SCROLL_STORE_KEY =
    "scroll-state";
const LAST_OPENED_KEY =
    "last-opened-files";
// max saved files PER FRAME
const MAX_SCROLL_HISTORY = 500;
