

const SearchEngine = {
    findMatches(doc, term) {
        const escaped = term.replace(/[.*?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "gi");
        const textNodes = [];
        collectTextNodes(doc.body, textNodes, regex);
        return textNodes;
    }
};
const SearchHighlighter = {
    apply(doc, regex) {
        removeHighlights(doc);
        highlightText(doc.body, regex, doc);
        return [...doc.querySelectorAll("mark")];
    },
    clear(doc) {
        removeHighlights(doc);
    }
};
// ======================================
// SEARCH SERVICE
// ======================================
const SearchService = {
    query(
        iframe,
        term
    ) {
        if (!iframe || !term) {
            return [];
        }
        const doc =
            iframe.contentDocument ||
            iframe.contentWindow.document;
        const regex =
            this.createRegex(
                term
            );
        return this.highlight(
            doc,
            regex
        );
    },
    highlight(
        doc,
        regex
    ) {
        return SearchHighlighter.apply(
            doc,
            regex
        );
    },
    clear(doc) {
        return SearchHighlighter.clear(
            doc
        );
    },
	resetFrame(iframe) {
		if (!iframe) {
			return;
		}
		const doc =
			iframe.contentDocument ||
			iframe.contentWindow?.document;
		if (!doc) {
			return;
		}
		return this.clear(doc);
	},
    createRegex(term) {
        return new RegExp(
            term.replace(
                /[.*?^${}()|[\]\\]/g,
                "\\$&"
            ),
            "gi"
        );
    }
};

// ======================================
// SEARCH CONTROLLER
// ======================================
const SearchController = {
    create({
        input,
        button,
        iframe,
        counter
    }) {
		if (
			!input ||
			!button ||
			!iframe ||
			!counter
		) {
			console.warn(
				"[SEARCH BIND SKIPPED]",
				{
					input,
					button,
					iframe,
					counter
				}
			);
			return;
		}
        const state = {
            matches: [],
            index: -1,
            lastTerm: ""
        };
        function updateCounter() {
            counter.textContent =
                state.matches.length === 0
                    ? "0/0"
                    : `${state.index + 1}/${state.matches.length}`;
        }
        function scrollToMatch(match) {
            const win =
                iframe.contentWindow;
            const rect =
                match.getBoundingClientRect();
            win.scrollTo({
                top:
                    win.scrollY +
                    rect.top -
                    CONFIG.search.scrollOffset,
                behavior: "auto"
            });
        }
        function resetSearch(term) {
            state.lastTerm =
                term;
            state.matches =
                SearchService.query(
                    iframe,
                    term
                );
            state.index =
                -1;
        }
        function advanceMatch() {
            if (!state.matches.length) {
                updateCounter();
                return;
            }
            state.index =
                (state.index + 1) %
                state.matches.length;
            scrollToMatch(
                state.matches[state.index]
            );
            updateCounter();
        }
        function runSearch() {
            const term =
                input.value.trim();
            if (!term) {
                return;
            }
            if (state.lastTerm !== term) {
                resetSearch(
                    term
                );
            }
            advanceMatch();
        }
        button.addEventListener(
            "click",
            runSearch
        );
        input.addEventListener(
            "keydown",
            e => {
                if (e.key === "Enter") {
                    runSearch();
                }
            }
        );
    }
};
const SearchBindingsService = {

    init() {

        [
            ["search", "go", "frameB", "countB"],
            ["searchC", "goC", "frameC", "countC"],
            ["searchD", "goD", "frameD", "countD"],
            ["searchE", "goE", "frameE", "countE"]
        ].forEach(
            ([inputId, buttonId, frameId, counterId]) => {

                SearchController.create({
                    input: document.getElementById(inputId),
                    button: document.getElementById(buttonId),
                    iframe: document.getElementById(frameId),
                    counter: document.getElementById(counterId)
                });

            }
        );
    }
};
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
