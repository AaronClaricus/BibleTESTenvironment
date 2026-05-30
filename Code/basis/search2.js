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

// ======================================
// STORE MATCH POSITIONS PER IFRAME
// ======================================
const searchState = {};

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
// ======================================
// GENERIC SEARCH FUNCTION
// ======================================


function setupIframeSearch(
    inputId,
    buttonId,
    iframeId,
    counterId
){

    const input =
        document.getElementById(inputId);

    const button =
        document.getElementById(buttonId);

    const iframe =
        document.getElementById(iframeId);

    const counter =
        document.getElementById(counterId);

    searchState[iframeId] = {
        matches: [],
        index: -1,
        lastTerm: ""
    };

    function updateCounter(){

        const state =
            searchState[iframeId];

        if(state.matches.length === 0){

            counter.textContent =
                "0/0";

            return;
        }

        counter.textContent =
            (state.index + 1) +
            "/" +
            state.matches.length;
    }

    function searchIframe(){

        const term =
            input.value.trim();

        if(!term){
            return;
        }

        const state =
            searchState[iframeId];

        const doc =
            iframe.contentDocument ||
            iframe.contentWindow.document;

        // ==========================
        // NEW SEARCH
        // ==========================
        if(state.lastTerm !== term){

            state.lastTerm = term;

            removeHighlights(doc);

            let escaped =
                term.replace(
                    /[.*?^${}()|[\]\\]/g,
                    "\\$&"
                );

            escaped =
                escaped.replace(
                    /\+/g,
                    ":"
                );

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

            state.matches =
                [...doc.querySelectorAll("mark")];

            state.index = -1;
        }

        if(state.matches.length === 0){

            updateCounter();

            return;
        }

        // ==========================
        // NEXT MATCH
        // ==========================
        state.index++;

        if(
            state.index >=
            state.matches.length
        ){
            state.index = 0;
        }

        const match =
            state.matches[state.index];

        match.scrollIntoView({
            behavior:"smooth",
            block:"center"
        });

        updateCounter();
    }

    button.addEventListener(
        "click",
        searchIframe
    );

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
    "frameB",
    "countB"
);

setupIframeSearch(
    "searchC",
    "goC",
    "frameC",
    "countC"
);

setupIframeSearch(
    "searchD",
    "goD",
    "frameD",
    "countD"
);

setupIframeSearch(
    "searchE",
    "goE",
    "frameE",
    "countE"
);
