// ==============================
// LAYOUT TOGGLE BUTTON
// ==============================
const toggleButton =
    document.getElementById("layoutToggle");

toggleButton.addEventListener(
    "click",
    function(){

        document.body.classList.toggle(
            "two-panel"
        );

        if(
            document.body.classList.contains(
                "two-panel"
            )
        ){

            toggleButton.textContent =
                "Switch to 3 Panel Mode";

        } else {

            toggleButton.textContent =
                "Switch to 2 Panel Mode";

        }

    }
);
