// ==============================
// LAYOUT MODE BUTTON
// cycles:
// 4 panel -> 3 panel -> 2 panel -> 1 panel
// ==============================
const toggleButton =
    document.getElementById("layoutToggle");

// current mode
let layoutMode = 4;

document.body.classList.add("four-panel");

// initial button text
toggleButton.textContent =
    "Switch to 3 Panel Mode";

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

        document.body.classList.add("three-panel");

        toggleButton.textContent =
            "Switch to 2 Panel Mode";

    }
    else if (layoutMode === 3) {

        layoutMode = 2;

        document.body.classList.add("two-panel");

        toggleButton.textContent =
            "Switch to 1 Panel Mode";

    }
    else if (layoutMode === 2) {

        layoutMode = 1;
	
        document.body.classList.add("one-panel");

        toggleButton.textContent =
            "Switch to 4 Panel Mode";

    }
    else {

        layoutMode = 4;

        document.body.classList.add("four-panel");

        toggleButton.textContent =
            "Switch to 3 Panel Mode";

    }

});
