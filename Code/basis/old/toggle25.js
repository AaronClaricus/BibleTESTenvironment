// ==============================
// LAYOUT MODE BUTTON
// cycles:
// 4 panel -> 3 panel -> 2 panel -> 1 panel
// ==============================
const toggleButton =
    document.getElementById("layoutToggle");
// ==============================
// LAYOUT STORAGE
// ==============================
const LAYOUT_MODE_KEY =
    "saved-layout-mode";
// current mode
// ==============================
// RESTORE SAVED LAYOUT
// ==============================
let layoutMode =
    Number(
        localStorage.getItem(
            LAYOUT_MODE_KEY
        )
    ) || 4;

// ==============================
// APPLY LAYOUT
// ==============================
function applyLayoutMode(){

    document.body.classList.remove(
        "four-panel",
        "three-panel",
        "two-panel",
        "one-panel"
    );

    if(layoutMode === 4){

        document.body.classList.add(
            "four-panel"
        );

        toggleButton.textContent =
            "Switch to 3 Panel Mode";
    }
    else if(layoutMode === 3){

        document.body.classList.add(
            "three-panel"
        );

        toggleButton.textContent =
            "Switch to 2 Panel Mode";
    }
    else if(layoutMode === 2){

        document.body.classList.add(
            "two-panel"
        );

        toggleButton.textContent =
            "Switch to 1 Panel Mode";
    }
    else{

        document.body.classList.add(
            "one-panel"
        );

        toggleButton.textContent =
            "Switch to 4 Panel Mode";
    }
}

// apply immediately
applyLayoutMode();

toggleButton.addEventListener("click", function () {

    // ======================
    // REMOVE ALL MODES
    // ======================
    document.body.classList.remove(
        "four-panel",
        "three-panel",
        "two-panel",
        "one-panel"
    );

    // ======================
    // CYCLE MODES
    // ======================
    if (layoutMode === 4) {

        layoutMode = 3;
        
        localStorage.setItem(
			LAYOUT_MODE_KEY,
			layoutMode
		);

        document.body.classList.add("three-panel");

        toggleButton.textContent =
            "Switch to 2 Panel Mode";

    }
    else if (layoutMode === 3) {

        layoutMode = 2;

        localStorage.setItem(
			LAYOUT_MODE_KEY,
			layoutMode
		);

        document.body.classList.add("two-panel");

        toggleButton.textContent =
            "Switch to 1 Panel Mode";

    }
    else if (layoutMode === 2) {

        layoutMode = 1;

        localStorage.setItem(
			LAYOUT_MODE_KEY,
			layoutMode
		);

	
        document.body.classList.add("one-panel");

        toggleButton.textContent =
            "Switch to 4 Panel Mode";

    }
    else {

        layoutMode = 4;

        localStorage.setItem(
			LAYOUT_MODE_KEY,
			layoutMode
		);

        document.body.classList.add("four-panel");

        toggleButton.textContent =
            "Switch to 3 Panel Mode";

    }

});
