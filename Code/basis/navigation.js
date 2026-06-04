const NavigationModel = {
    structure: NAVIGATION,
    getStructure() {
        return this.structure;
    }
};

function buildNavigation(containerId, data){
    const container =
        document.getElementById(containerId);
    const ul = document.createElement("ul");
    data.forEach(node => {
        ul.appendChild(
            createTree(node)
        );
    });
    container.appendChild(ul);
}
function createTree(node){
    const li = document.createElement("li");
    // ======================================
    // BOOK
    // ["Matthew", "./Gospel/Matthew"]
    // ======================================
    if(typeof node[1] === "string"){
        const button = document.createElement("button");
        button.className = "toggle";
        button.textContent = "▶ " + node[0];
        li.appendChild(button);
        const nested = document.createElement("ul");
        nested.className = "nested";
		FRAMES.forEach(frame => {
			const frameLi =
				document.createElement("li");
			// ==============================
			// CENTER PANEL ITEMS
			// ==============================
			if(frame[0] === "frameC"){
				frameLi.classList.add(
					"center-item"
				);
			}
			// ==============================
			// RIGHT PANEL ITEMS
			// ==============================
			if(frame[0] === "frameD"){
				frameLi.classList.add(
					"center-item2"
				);
			}
			// ==============================
			// FAR RIGHT PANEL ITEMS
			// ==============================
			if(frame[0] === "frameE"){
				frameLi.classList.add(
					"center-item3"
				);
			}
			const link =
				document.createElement("button");
				link.type = "button";
			link.className = "file-link";
			link.dataset.frame = frame[0];
			link.dataset.file = node[1];
			link.textContent =
				frame[1] + " : " + node[0];
			frameLi.appendChild(link);
			nested.appendChild(frameLi);
		});
        li.appendChild(nested);
        return li;
    }
    // ======================================
    // CATEGORY
    // ["Gospel", [...], [...]]
    // ======================================
    const button = document.createElement("button");
    button.className = "toggle";
    button.textContent = "▶ " + node[0];
    li.appendChild(button);
    const nested = document.createElement("ul");
    nested.className = "nested";
    for(let i = 1; i < node.length; i++){
        nested.appendChild(
            createTree(node[i])
        );
    }
    li.appendChild(nested);
    return li;
}

const NavigationService = {
	buildNavigation() {
		buildNavigation(
			"navA",
			NavigationModel.getStructure()
		);
	},
    setupTreeToggle() {
        document.addEventListener(
            "click",
            e => {
                // ==============================
                // NAV TREE TOGGLE
                // ==============================
                const toggle =
                    e.target.closest(
                        ".toggle"
                    );
                if(toggle){
                    const nested =
                        toggle.parentElement.querySelector(
                            ":scope > .nested"
                        );
                    if(!nested){
                        return;
                    }
                    if(
                        nested.classList.contains(
                            "open"
                        )
                    ){
                        nested.classList.remove(
                            "open"
                        );
                        toggle.textContent =
                            toggle.textContent.replace(
                                "▼",
                                "▶"
                            );
                    }
                    else{
                        nested.classList.add(
                            "open"
                        );
                        toggle.textContent =
                            toggle.textContent.replace(
                                "▶",
                                "▼"
                            );
                    }
                    return;
                }
            }
        );
    }
};
