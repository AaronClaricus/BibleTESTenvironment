	// ======================================
// TOGGLE SEARCH VISIBILITY
// ======================================
const toggleSearch =
    document.getElementById(
        "toggleSearch"
    );

toggleSearch.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "hide-search"
        );

        // BUTTON TEXT
        if(
            document.body.classList.contains(
                "hide-search"
            )
        ){
            toggleSearch.textContent =
                "Show Search";
        }
        else{
            toggleSearch.textContent =
                "Hide Search";
        }
    }
);



const toggleGo =
    document.getElementById("toggleGo");

toggleGo.addEventListener("click", () => {

    document.body.classList.toggle("hide-go");

    if(document.body.classList.contains("hide-go")){
        toggleGo.textContent = "Show Go";
    } else {
        toggleGo.textContent = "Hide Go";
    }
});
// ======================================
// REMOVE OLD HIGHLIGHTS
// ======================================
function removeHighlights(doc){

    const marks =
        doc.querySelectorAll("mark");

    marks.forEach(mark => {

        const parent =
            mark.parentNode;

        parent.replaceChild(
            doc.createTextNode(
                mark.textContent
            ),
            mark
        );

        parent.normalize();
    });
}

// ======================================
// HIGHLIGHT TEXT
// ======================================
function highlightText(node, regex, doc){

    // TEXT NODE
    if(node.nodeType === 3){

        const text =
            node.textContent;

        if(regex.test(text)){

            const span =
                doc.createElement("span");

            span.innerHTML =
                text.replace(
                    regex,
                    match =>
                        `<mark>${match}</mark>`
                );

            node.parentNode.replaceChild(
                span,
                node
            );
        }

        return;
    }

    // ELEMENT NODE
    if(node.nodeType === 1){

        const tag =
            node.tagName;

        if(
            tag === "SCRIPT" ||
            tag === "STYLE"  ||
            tag === "MARK"
        ){
            return;
        }

        [...node.childNodes].forEach(
            child =>
                highlightText(
                    child,
                    regex,
                    doc
                )
        );
    }
}

// ======================================
// GENERIC SEARCH FUNCTION
// ======================================
function setupIframeSearch(
    inputId,
    buttonId,
    iframeId
){

    const input =
        document.getElementById(inputId);

    const button =
        document.getElementById(buttonId);

    const iframe =
        document.getElementById(iframeId);

    function searchIframe(){

        const term =
            input.value.trim();

        if(!term){
            return;
        }

        const doc =
            iframe.contentDocument ||
            iframe.contentWindow.document;

        removeHighlights(doc);

// ======================================
// ESCAPE REGEX CHARACTERS
// ======================================
let escaped =
    term.replace(
        /[.*?^${}()|[\]\\]/g,
        "\\$&"
    );

// ======================================
// "+" ACTS LIKE ":"
// example:
// Jesus+said
// matches:
// Jesus:said
// ======================================
escaped =
    escaped.replace(
        /\+/g,
        ":"
    );

// ======================================
// CREATE REGEX
// ======================================
const regex =
    new RegExp(
        escaped,
        "gi"
    );

        highlightText(
            doc.body,
            regex,
            doc
        );
        // ======================================
			// SCROLL TO FIRST MATCH
			// ======================================
			const firstMatch =
				doc.querySelector("mark");

			if(firstMatch){

				firstMatch.scrollIntoView({
					behavior:"smooth",
					block:"center"
				});
			}
    }

    // BUTTON
    button.addEventListener(
        "click",
        searchIframe
    );

    // ENTER KEY
    input.addEventListener(
        "keydown",
        event => {

            if(event.key === "Enter"){
                searchIframe();
            }
        }
    );
}

// ======================================
// INITIALIZE ALL 4 SEARCHES
// ======================================
setupIframeSearch(
    "search",
    "go",
    "frameB"
);

setupIframeSearch(
    "searchC",
    "goC",
    "frameC"
);

setupIframeSearch(
    "searchD",
    "goD",
    "frameD"
);

setupIframeSearch(
    "searchE",
    "goE",
    "frameE"
);
