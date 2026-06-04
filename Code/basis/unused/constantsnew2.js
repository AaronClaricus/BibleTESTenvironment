


// ==============================
// FONT SIZE CONTROL
// ==============================
const fontSelector =
    document.getElementById(
        "fontSelector"
    );
// ==============================
// RESTORE SAVED LAYOUT
// ==============================
const SEARCH_KEY =
	CONFIG.storage.searchKey;
const GO_KEY =
	CONFIG.storage.goKey;
const CONTROLS_KEY =
	CONFIG.storage.controlsKey;
	const highlightSelector =
    document.getElementById("highlightSelector");


	// ======================================
	// END GLOBAL VARIABLES
	// ======================================
	// ======================================
	// Services
	// ======================================
	





// ======================================
// DOCUMENT SERVICE
// ======================================



const selected = highlightSelector?.value;
const scheme = UIService.getHighlightScheme(selected);
const toggleControls =
    document.getElementById("toggleControls");
