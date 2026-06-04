// ======================================
// BEGIN GLOBAL VARIABLES
// ======================================
const CONTROLS_KEY =
    "navControlsHidden";
const toggleSearch =
    document.getElementById(
        "toggleSearch"
    );
const searchState = {};

const toggleGo =
    document.getElementById("toggleGo");
const highlightSelector =
    document.getElementById("highlightSelector");
const highlightSchemes = {
    blue: {
        bg: "#141414",
        text: "#0066ff"
    },
    yellow: {
        bg: "#141414",
        text: "#ffd54f"
    },
    green: {
        bg: "#141414",
        text: "#008529"
    },
    orange: {
        bg: "#141414",
        text: "#c45f00"
    },
    purple: {
        bg: "#141414",
        text: "#7b1fa2"
    },
    lightgreen: {
        bg: "#141414",
        text: "#00ff99"
    }
};
// ==============================
// TRACKING STORAGE
// ==============================
const currentFiles = {};
const savedScrollPositions = {};
// ==============================
// FILE CACHE
// ==============================
const fileCache = {};
// max cached files
const MAX_CACHE = 500;
// tracks cache order
const cacheOrder = [];
// ==============================
// SCROLL STATE STORAGE
// ==============================
const SCROLL_STORE_KEY =
    "scroll-state";
const LAST_OPENED_KEY =
    "last-opened-files";
// max saved files PER FRAME
const MAX_SCROLL_HISTORY = 500;
const lastOpened =
    loadLastOpenedFiles();
 // ==============================
// FONT STORAGE
// ==============================
const FONT_SIZE_KEY =
    "saved-font-size";
const HIGHLIGHT_KEY = "saved-highlight-scheme";
// ==============================
// FONT SIZE CONTROL
// ==============================
const fontSelector =
    document.getElementById(
        "fontSelector"
    );
const savedFontSize =
    localStorage.getItem(
        FONT_SIZE_KEY
    );
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
// NAVIGATION CONSTANT
// ==============================
const NAVIGATION = [

 	[
		"New Unauthorized WEB 2020/2026N: New Testament",

		[
			"Gospel",

			["Matthew", "./WEB/Gospel/Matthew"],
			["Mark", "./WEB/Gospel/Mark"],
			["Luke", "./WEB/Gospel/Luke"],
			["John", "./WEB/Gospel/John"]
		],

		[
			"Pauline Epistles",

			["Romans", "./WEB/Epistles/Romans"],
			["1 Corinthians", "./WEB/Epistles/1 Corinthians"],
			["2 Corinthians", "./WEB/Epistles/2 Corinthians"],
			["Galatians", "./WEB/Epistles/Galatians"],
			["Ephesians", "./WEB/Epistles/Ephesians"],
			["Philippians", "./WEB/Epistles/Philippians"],
			["Colossians", "./WEB/Epistles/Colossians"],
			["1 Thessalonians", "./WEB/Epistles/1 Thessalonians"],
			["2 Thessalonians", "./WEB/Epistles/2 Thessalonians"],
			["1 Timothy", "./WEB/Epistles/1 Timothy"],
			["2 Timothy", "./WEB/Epistles/2 Timothy"],
			["Titus", "./WEB/Epistles/Titus"],
			["Philemon", "./WEB/Epistles/Philemon"],
			["Hebrews", "./WEB/Epistles/Hebrews"]
		],

		[
			"Epistles",

			["James", "./WEB/Epistles/James"],
			["1 Peter", "./WEB/Epistles/1 Peter"],
			["2 Peter", "./WEB/Epistles/2 Peter"],
			["1 John", "./WEB/Epistles/1 John"],
			["2 John", "./WEB/Epistles/2 John"],
			["3 John", "./WEB/Epistles/3 John"],
			["Jude", "./WEB/Epistles/Jude"]
		],

		[
			"History",

			["Acts", "./WEB/History/Acts"]
		],

		[
			"Prophecy",

			["Revelation", "./WEB/Prophets/Revelation"]
		]
	],

	[
		"New Unauthorized WEB 2020/2026N: Old Testament",

		[
			"Law",

			["Genesis", "./WEB/Law/Genesis"],
			["Exodus", "./WEB/Law/Exodus"],
			["Leviticus", "./WEB/Law/Leviticus"],
			["Numbers", "./WEB/Law/Numbers"],
			["Deuteronomy", "./WEB/Law/Deuteronomy"]
		],
		[
			"History",

			["Joshua", "./WEB/History/Joshua"],
			["Judges", "./WEB/History/Judges"],
			["Ruth", "./WEB/History/Ruth"],
			["1 Samuel", "./WEB/History/1 Samuel"],
			["2 Samuel", "./WEB/History/2 Samuel"],
			["1 Kings", "./WEB/History/1 Kings"],
			["2 Kings", "./WEB/History/2 Kings"],
			["1 Chronicles", "./WEB/History/1 Chronicles"],
			["2 Chronicles", "./WEB/History/2 Chronicles"],
			["Ezra", "./WEB/History/Ezra"],
			["Nehemiah", "./WEB/History/Nehemiah"],
			["Esther", "./WEB/History/Esther"]
		],
		[
			"Poetry",

			["Job", "./WEB/Poetry/Job"],
			["Psalms", "./WEB/Poetry/Psalms"],
			["Proverbs", "./WEB/Poetry/Proverbs"],
			["Ecclesiastes", "./WEB/Poetry/Ecclesiastes"],
			["Song of Solomon", "./WEB/Poetry/Song of Solomon"]
		],
		[
			"Major Prophets",

			["Isaiah", "./WEB/Prophets/Isaiah"],
			["Jeremiah", "./WEB/Prophets/Jeremiah"],
			["Lamentations", "./WEB/Prophets/Lamentations"],
			["Ezekiel", "./WEB/Prophets/Ezekiel"],
			["Daniel", "./WEB/Prophets/Daniel"]
		],
		[
			"Minor Prophets",

			["Hosea", "./WEB/Prophets/Hosea"],
			["Joel", "./WEB/Prophets/Joel"],
			["Amos", "./WEB/Prophets/Amos"],
			["Obadiah", "./WEB/Prophets/Obadiah"],
			["Jonah", "./WEB/Prophets/Jonah"],
			["Micah", "./WEB/Prophets/Micah"],
			["Nahum", "./WEB/Prophets/Nahum"],
			["Habakkuk", "./WEB/Prophets/Habakkuk"],
			["Zephaniah", "./WEB/Prophets/Zephaniah"],
			["Haggai", "./WEB/Prophets/Haggai"],
			["Zechariah", "./WEB/Prophets/Zechariah"],
			["Malachi", "./WEB/Prophets/Malachi"]
		]
	],
	
	[
		"Berean Greek-English Interlinear New Testament",

		[
			"Gospel",

			["Matthew", "./Gospel/Matthew Interlinear"],
			["Mark", "./Gospel/Mark Interlinear"],
			["Luke", "./Gospel/Luke Interlinear"],
			["John", "./Gospel/John Interlinear"]
		],

		[
			"Pauline Epistles",

			["Romans", "./Epistles/Romans Interlinear"],
			["1 Corinthians", "./Epistles/1 Corinthians Interlinear"],
			["2 Corinthians", "./Epistles/2 Corinthians Interlinear"],
			["Galatians", "./Epistles/Galatians Interlinear"],
			["Ephesians", "./Epistles/Ephesians Interlinear"],
			["Philippians", "./Epistles/Philippians Interlinear"],
			["Colossians", "./Epistles/Colossians Interlinear"],
			["1 Thessalonians", "./Epistles/1 Thessalonians Interlinear"],
			["2 Thessalonians", "./Epistles/2 Thessalonians Interlinear"],
			["1 Timothy", "./Epistles/1 Timothy Interlinear"],
			["2 Timothy", "./Epistles/2 Timothy Interlinear"],
			["Titus", "./Epistles/Titus Interlinear"],
			["Philemon", "./Epistles/Philemon Interlinear"],
			["Hebrews", "./Epistles/Hebrews Interlinear"]
		],

		[
			"Epistles",

			["James", "./Epistles/James Interlinear"],
			["1 Peter", "./Epistles/1 Peter Interlinear"],
			["2 Peter", "./Epistles/2 Peter Interlinear"],
			["1 John", "./Epistles/1 John Interlinear"],
			["2 John", "./Epistles/2 John Interlinear"],
			["3 John", "./Epistles/3 John Interlinear"],
			["Jude", "./Epistles/Jude Interlinear"]
		],

		[
			"History",

			["Acts", "./History/Acts Interlinear"]
		],

		[
			"Prophecy",

			["Revelation", "./Prophets/Revelation Interlinear"]
		]
	],
	
		[
			"Berean Greek New Testament",

			[
				"Gospel",

				["Matthew", "./BG/Gospel/Matthew Greek"],
				["Mark", "./BG/Gospel/Mark Greek"],
				["Luke", "./BG/Gospel/Luke Greek"],
				["John", "./BG/Gospel/John Greek"]
			],

			[
				"Pauline Epistles",

				["Romans", "./BG/Epistles/Romans Greek"],
				["1 Corinthians", "./BG/Epistles/1 Corinthians Greek"],
				["2 Corinthians", "./BG/Epistles/2 Corinthians Greek"],
				["Galatians", "./BG/Epistles/Galatians Greek"],
				["Ephesians", "./BG/Epistles/Ephesians Greek"],
				["Philippians", "./BG/Epistles/Philippians Greek"],
				["Colossians", "./BG/Epistles/Colossians Greek"],
				["1 Thessalonians", "./BG/Epistles/1 Thessalonians Greek"],
				["2 Thessalonians", "./BG/Epistles/2 Thessalonians Greek"],
				["1 Timothy", "./BG/Epistles/1 Timothy Greek"],
				["2 Timothy", "./BG/Epistles/2 Timothy Greek"],
				["Titus", "./BG/Epistles/Titus Greek"],
				["Philemon", "./BG/Epistles/Philemon Greek"],
				["Hebrews", "./BG/Epistles/Hebrews Greek"]
			],

			[
				"Epistles",

				["James", "./BG/Epistles/James Greek"],
				["1 Peter", "./BG/Epistles/1 Peter Greek"],
				["2 Peter", "./BG/Epistles/2 Peter Greek"],
				["1 John", "./BG/Epistles/1 John Greek"],
				["2 John", "./BG/Epistles/2 John Greek"],
				["3 John", "./BG/Epistles/3 John Greek"],
				["Jude", "./BG/Epistles/Jude Greek"]
			],

			[
				"History",

				["Acts", "./BG/History/Acts Greek"]
			],

			[
				"Prophecy",

				["Revelation", "./BG/Prophecy/Revelation Greek"]
			]
		],
	
	[
		"King James Version 1611: New Testament",

		[
			"Gospel",

			["Matthew", "./KJV/Gospel/Matthew"],
			["Mark", "./KJV/Gospel/Mark"],
			["Luke", "./KJV/Gospel/Luke"],
			["John", "./KJV/Gospel/John"]
		],

		[
			"Pauline Epistles",

			["Romans", "./KJV/Epistles/Romans"],
			["1 Corinthians", "./KJV/Epistles/1 Corinthians"],
			["2 Corinthians", "./KJV/Epistles/2 Corinthians"],
			["Galatians", "./KJV/Epistles/Galatians"],
			["Ephesians", "./KJV/Epistles/Ephesians"],
			["Philippians", "./KJV/Epistles/Philippians"],
			["Colossians", "./KJV/Epistles/Colossians"],
			["1 Thessalonians", "./KJV/Epistles/1 Thessalonians"],
			["2 Thessalonians", "./KJV/Epistles/2 Thessalonians"],
			["1 Timothy", "./KJV/Epistles/1 Timothy"],
			["2 Timothy", "./KJV/Epistles/2 Timothy"],
			["Titus", "./KJV/Epistles/Titus"],
			["Philemon", "./KJV/Epistles/Philemon"],
			["Hebrews", "./KJV/Epistles/Hebrews"]
		],

		[
			"Epistles",

			["James", "./KJV/Epistles/James"],
			["1 Peter", "./KJV/Epistles/1 Peter"],
			["2 Peter", "./KJV/Epistles/2 Peter"],
			["1 John", "./KJV/Epistles/1 John"],
			["2 John", "./KJV/Epistles/2 John"],
			["3 John", "./KJV/Epistles/3 John"],
			["Jude", "./KJV/Epistles/Jude"]
		],

		[
			"History",

			["Acts", "./KJV/History/Acts"]
		],

		[
			"Prophecy",

			["Revelation", "./KJV/Prophets/Revelation"]
		]
	],

	[
		"King James Version 1611: Old Testament",

		[
			"Law",

			["Genesis", "./KJV/Law/Genesis"],
			["Exodus", "./KJV/Law/Exodus"],
			["Leviticus", "./KJV/Law/Leviticus"],
			["Numbers", "./KJV/Law/Numbers"],
			["Deuteronomy", "./KJV/Law/Deuteronomy"]
		],
		[
			"History",

			["Joshua", "./KJV/History/Joshua"],
			["Judges", "./KJV/History/Judges"],
			["Ruth", "./KJV/History/Ruth"],
			["1 Samuel", "./KJV/History/1 Samuel"],
			["2 Samuel", "./KJV/History/2 Samuel"],
			["1 Kings", "./KJV/History/1 Kings"],
			["2 Kings", "./KJV/History/2 Kings"],
			["1 Chronicles", "./KJV/History/1 Chronicles"],
			["2 Chronicles", "./KJV/History/2 Chronicles"],
			["Ezra", "./KJV/History/Ezra"],
			["Nehemiah", "./KJV/History/Nehemiah"],
			["Esther", "./KJV/History/Esther"]
		],
		[
			"Poetry",

			["Job", "./KJV/Poetry/Job"],
			["Psalms", "./KJV/Poetry/Psalms"],
			["Proverbs", "./KJV/Poetry/Proverbs"],
			["Ecclesiastes", "./KJV/Poetry/Ecclesiastes"],
			["Song of Solomon", "./KJV/Poetry/Song of Solomon"]
		],
		[
			"Major Prophets",

			["Isaiah", "./KJV/Prophets/Isaiah"],
			["Jeremiah", "./KJV/Prophets/Jeremiah"],
			["Lamentations", "./KJV/Prophets/Lamentations"],
			["Ezekiel", "./KJV/Prophets/Ezekiel"],
			["Daniel", "./KJV/Prophets/Daniel"]
		],
		[
			"Minor Prophets",

			["Hosea", "./KJV/Prophets/Hosea"],
			["Joel", "./KJV/Prophets/Joel"],
			["Amos", "./KJV/Prophets/Amos"],
			["Obadiah", "./KJV/Prophets/Obadiah"],
			["Jonah", "./KJV/Prophets/Jonah"],
			["Micah", "./KJV/Prophets/Micah"],
			["Nahum", "./KJV/Prophets/Nahum"],
			["Habakkuk", "./KJV/Prophets/Habakkuk"],
			["Zephaniah", "./KJV/Prophets/Zephaniah"],
			["Haggai", "./KJV/Prophets/Haggai"],
			["Zechariah", "./KJV/Prophets/Zechariah"],
			["Malachi", "./KJV/Prophets/Malachi"]
		]
	],
[
    "Geneva 1560: New Testament",

    [
        "Gospel",

        ["Matthew", "./Geneva/Gospel/Matthew"],
        ["Mark", "./Geneva/Gospel/Mark"],
        ["Luke", "./Geneva/Gospel/Luke"],
        ["John", "./Geneva/Gospel/John"]
    ],

    [
        "Pauline Epistles",

        ["Romans", "./Geneva/Epistles/Romans"],
        ["1 Corinthians", "./Geneva/Epistles/1 Corinthians"],
        ["2 Corinthians", "./Geneva/Epistles/2 Corinthians"],
        ["Galatians", "./Geneva/Epistles/Galatians"],
        ["Ephesians", "./Geneva/Epistles/Ephesians"],
        ["Philippians", "./Geneva/Epistles/Philippians"],
        ["Colossians", "./Geneva/Epistles/Colossians"],
        ["1 Thessalonians", "./Geneva/Epistles/1 Thessalonians"],
        ["2 Thessalonians", "./Geneva/Epistles/2 Thessalonians"],
        ["1 Timothy", "./Geneva/Epistles/1 Timothy"],
        ["2 Timothy", "./Geneva/Epistles/2 Timothy"],
        ["Titus", "./Geneva/Epistles/Titus"],
        ["Philemon", "./Geneva/Epistles/Philemon"],
        ["Hebrews", "./Geneva/Epistles/Hebrews"]
    ],

    [
        "Epistles",

        ["James", "./Geneva/Epistles/James"],
        ["1 Peter", "./Geneva/Epistles/1 Peter"],
        ["2 Peter", "./Geneva/Epistles/2 Peter"],
        ["1 John", "./Geneva/Epistles/1 John"],
        ["2 John", "./Geneva/Epistles/2 John"],
        ["3 John", "./Geneva/Epistles/3 John"],
        ["Jude", "./Geneva/Epistles/Jude"]
    ],

    [
        "History",

        ["Acts", "./Geneva/History/Acts"]
    ],

    [
        "Prophecy",

        ["Revelation", "./Geneva/Prophets/Revelation"]
    ]
],

	[
		"Geneva 1560: Old Testament",

		[
			"Law",

			["Genesis", "./Geneva/Law/Genesis"],
			["Exodus", "./Geneva/Law/Exodus"],
			["Leviticus", "./Geneva/Law/Leviticus"],
			["Numbers", "./Geneva/Law/Numbers"],
			["Deuteronomy", "./Geneva/Law/Deuteronomy"]
		],
		[
			"History",

			["Joshua", "./Geneva/History/Joshua"],
			["Judges", "./Geneva/History/Judges"],
			["Ruth", "./Geneva/History/Ruth"],
			["1 Samuel", "./Geneva/History/1 Samuel"],
			["2 Samuel", "./Geneva/History/2 Samuel"],
			["1 Kings", "./Geneva/History/1 Kings"],
			["2 Kings", "./Geneva/History/2 Kings"],
			["1 Chronicles", "./Geneva/History/1 Chronicles"],
			["2 Chronicles", "./Geneva/History/2 Chronicles"],
			["Ezra", "./Geneva/History/Ezra"],
			["Nehemiah", "./Geneva/History/Nehemiah"],
			["Esther", "./Geneva/History/Esther"]
		],
		[
			"Poetry",

			["Job", "./Geneva/Poetry/Job"],
			["Psalms", "./Geneva/Poetry/Psalms"],
			["Proverbs", "./Geneva/Poetry/Proverbs"],
			["Ecclesiastes", "./Geneva/Poetry/Ecclesiastes"],
			["Song of Solomon", "./Geneva/Poetry/Song of Solomon"]
		],
		[
			"Major Prophets",

			["Isaiah", "./Geneva/Prophets/Isaiah"],
			["Jeremiah", "./Geneva/Prophets/Jeremiah"],
			["Lamentations", "./Geneva/Prophets/Lamentations"],
			["Ezekiel", "./Geneva/Prophets/Ezekiel"],
			["Daniel", "./Geneva/Prophets/Daniel"]
		],
		[
			"Minor Prophets",

			["Hosea", "./Geneva/Prophets/Hosea"],
			["Joel", "./Geneva/Prophets/Joel"],
			["Amos", "./Geneva/Prophets/Amos"],
			["Obadiah", "./Geneva/Prophets/Obadiah"],
			["Jonah", "./Geneva/Prophets/Jonah"],
			["Micah", "./Geneva/Prophets/Micah"],
			["Nahum", "./Geneva/Prophets/Nahum"],
			["Habakkuk", "./Geneva/Prophets/Habakkuk"],
			["Zephaniah", "./Geneva/Prophets/Zephaniah"],
			["Haggai", "./Geneva/Prophets/Haggai"],
			["Zechariah", "./Geneva/Prophets/Zechariah"],
			["Malachi", "./Geneva/Prophets/Malachi"]
		]
	],

	
   [
        "American Standard Version 1901 Text: New Testament",

        [
            "Gospel",

            ["Matthew", "./Gospel/Matthew"],
            ["Mark", "./Gospel/Mark"],
            ["Luke", "./Gospel/Luke"],
            ["John", "./Gospel/John"]
        ],

		[
			"Pauline Epistles",

			["Romans", "./Epistles/Romans"],
			["1 Corinthians", "./Epistles/1 Corinthians"],
			["2 Corinthians", "./Epistles/2 Corinthians"],
			["Galatians", "./Epistles/Galatians"],
			["Ephesians", "./Epistles/Ephesians"],
			["Philippians", "./Epistles/Philippians"],
			["Colossians", "./Epistles/Colossians"],
			["1 Thessalonians", "./Epistles/1 Thessalonians"],
			["2 Thessalonians", "./Epistles/2 Thessalonians"],
			["1 Timothy", "./Epistles/1 Timothy"],
			["2 Timothy", "./Epistles/2 Timothy"],
			["Titus", "./Epistles/Titus"],
			["Philemon", "./Epistles/Philemon"],
			["Hebrews", "./Epistles/Hebrews"]
		],
				

		[
            "Epistles",

            ["James", "./Epistles/James"],
				["1 Peter", "./Epistles/1 Peter"],
				["2 Peter", "./Epistles/2 Peter"],
				["1 John", "./Epistles/1 John"],
				["2 John", "./Epistles/2 John"],
				["3 John", "./Epistles/3 John"],
				["Jude", "./Epistles/Jude"]
        ],


        [
            "History",

            ["Acts", "./History/Acts"]
        ],
		[
            "Prophecy",

            ["Revelation", "./Prophets/Revelation"]
        ]

    ],

    [
        "American Standard Version 1901 Text: Old Testament",

		[
			"Law",

			["Genesis", "./Law/Genesis"],
			["Exodus", "./Law/Exodus"],
			["Leviticus", "./Law/Leviticus"],
			["Numbers", "./Law/Numbers"],
			["Deuteronomy", "./Law/Deuteronomy"]
		],
		[
			"History",

			["Joshua", "./History/Joshua"],
			["Judges", "./History/Judges"],
			["Ruth", "./History/Ruth"],
			["1 Samuel", "./History/1 Samuel"],
			["2 Samuel", "./History/2 Samuel"],
			["1 Kings", "./History/1 Kings"],
			["2 Kings", "./History/2 Kings"],
			["1 Chronicles", "./History/1 Chronicles"],
			["2 Chronicles", "./History/2 Chronicles"],
			["Ezra", "./History/Ezra"],
			["Nehemiah", "./History/Nehemiah"],
			["Esther", "./History/Esther"]
		],
		[
			"Poetry",

			["Job", "./Poetry/Job"],
			["Psalms", "./Poetry/Psalms"],
			["Proverbs", "./Poetry/Proverbs"],
			["Ecclesiastes", "./Poetry/Ecclesiastes"],
			["Song of Solomon", "./Poetry/Song of Solomon"]
		],
		[
			"Major Prophets",

			["Isaiah", "./Prophets/Isaiah"],
			["Jeremiah", "./Prophets/Jeremiah"],
			["Lamentations", "./Prophets/Lamentations"],
			["Ezekiel", "./Prophets/Ezekiel"],
			["Daniel", "./Prophets/Daniel"]
		],
		[
			"Minor Prophets",

			["Hosea", "./Prophets/Hosea"],
			["Joel", "./Prophets/Joel"],
			["Amos", "./Prophets/Amos"],
			["Obadiah", "./Prophets/Obadiah"],
			["Jonah", "./Prophets/Jonah"],
			["Micah", "./Prophets/Micah"],
			["Nahum", "./Prophets/Nahum"],
			["Habakkuk", "./Prophets/Habakkuk"],
			["Zephaniah", "./Prophets/Zephaniah"],
			["Haggai", "./Prophets/Haggai"],
			["Zechariah", "./Prophets/Zechariah"],
			["Malachi", "./Prophets/Malachi"]
		]
    ]
	
];
// ==========================================
// FRAME CONFIG
// ==========================================
const FRAMES = [
    ["frameB", "LEFT"],
    ["frameC", "CENTER"],
    ["frameD", "RIGHT"],
    ["frameE", "FAR RIGHT"],

];
// ==============================
// TEMPLATE CACHE
// ==============================
let TEMPLATE_HTML = "";
	// ======================================
	// END GLOBAL VARIABLES
	// ======================================
	// ======================================
	// BEGIN EVENTS LISTENERS
	// ======================================
// ==========================================
// INIT
// ==========================================
function buildNavNew(){
	buildNavigation("navA", NAVIGATION);
}
// ==========================================
// TOGGLE
// ==========================================
function toggleNav(){
	document.addEventListener("click", function(e){
		console.log("CLICK");
		if(
			!e.target.classList.contains("toggle")
		){
			return;
		}
		console.log("TOGGLE CLICKED");
		const nested =
			e.target.parentElement.querySelector(".nested");
		console.log(nested);
		if(!nested) return;
		if(
			nested.classList.contains("open")
		){
			nested.classList.remove("open");
			e.target.textContent =
				e.target.textContent.replace("▼","▶");
		}else{
			nested.classList.add("open");
			e.target.textContent =
				e.target.textContent.replace("▶","▼");
		}
	});	
}
	
	
	
// ======================================
// TOGGLE NAV CONTROLS
// ======================================
// ==============================
// LAST OPENED FILE STORAGE
// ==============================

function scriptLoaded(){
	window.addEventListener("load", () => {
		console.log("SCRIPT LOADED");
		// ==============================
		// FILE LINK HANDLERS
		// ==============================
		document.querySelectorAll(".file-link").forEach(link => {
			link.addEventListener("click", () => {
				loadTextFile(
					link.dataset.frame,
					link.dataset.file
				);
			});
		});
	});
}
function setupNavControlsToggle(){
	const toggleControls =
		document.getElementById(
			"toggleControls"
		);

	const navControls =
		document.querySelector(
			".nav-controls"
		);

	if(
		!toggleControls ||
		!navControls
	){
		return;
	}

	// ==========================
	// RESTORE SAVED STATE
	// ==========================
	const hidden =
		localStorage.getItem(
			CONTROLS_KEY
		) === "true";

	if(hidden){
		navControls.style.display =
			"none";

		toggleControls.textContent =
			"Show Controls";
	}

	// ==========================
	// TOGGLE
	// ==========================
	toggleControls.addEventListener(
		"click",
		() => {

			const isHidden =
				navControls.style.display ===
				"none";

			if(isHidden){

				navControls.style.display =
					"flex";

				toggleControls.textContent =
					"Hide Controls";

				localStorage.setItem(
					CONTROLS_KEY,
					"false"
				);

			}else{

				navControls.style.display =
					"none";

				toggleControls.textContent =
					"Show Controls";

				localStorage.setItem(
					CONTROLS_KEY,
					"true"
				);
			}
		}
	);
		
}


// ======================================
// TOGGLE SEARCH VISIBILITY
// ======================================

function setupSearchToggle(){
	toggleSearch?.addEventListener(
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
}
function setupGoToggle(){
	toggleGo?.addEventListener("click", () => {

		document.body.classList.toggle("hide-go");

		if(document.body.classList.contains("hide-go")){
			toggleGo.textContent = "Show Go";
		} else {
			toggleGo.textContent = "Hide Go";
		}
	});
}



// ==========================================
// FILE LINKS
// ==========================================
function setupFileLinks(){
	document.addEventListener("click", e => {
		const link =
			e.target.closest(".file-link");
		if(!link) return;
		const frame =
			document.getElementById(
				link.dataset.frame
			);
		if(!frame) return;
		frame.src =
			link.dataset.file + ".html";
	});
}

function setupLayoutToggle(){
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
}




	// ======================================
	// END EVENTS LISTENERS
	// ======================================
	// ======================================
	// BEGIN ASYNC FUNCTIONS
	// ======================================

// ==============================
// LOAD TEMPLATE ONCE
// ==============================
async function initTemplate(){
    if(TEMPLATE_HTML) return;
    const response =
        await fetch("./Code/template.html");
    TEMPLATE_HTML =
        await response.text();
}
// ==============================
// fetch text file
// ==============================
async function fetchTextFile(file) {
    // ==========================
    // RETURN CACHED VERSION
    // ==========================
    if (fileCache[file]) {
        console.log(
            "[CACHE HIT]",
            file
        );
        return fileCache[file];
    }
    // ==========================
    // FETCH FILE
    // ==========================
    console.log(
        "[FETCH]",
        file
    );
    const response =
        await fetch(file);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${file}`
        );
    }
    const text =
        await response.text();
	// ==============================
	// CACHE FILE
	// ==============================
	fileCache[file] = text;
	// remember order
	cacheOrder.push(file);
	// remove oldest cache entry
	if (cacheOrder.length > MAX_CACHE) {
		const oldest =
			cacheOrder.shift();
		delete fileCache[oldest];
		console.log(
			"[CACHE REMOVED]",
			oldest
		);
	}
    return text;
}
// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;
    currentFiles[frameId] = file;
    saveLastOpenedFile(
		frameId,
		file
	);
    try {
        await initTemplate();
		const text = await fetchTextFile(file);
		const scheme = getHighlightScheme(highlightSchemes);
		setIframeContent(iframe, text, scheme);
    } catch (err) {
    handleIframeError(err, iframe);
	}
}
	// ======================================
	// END ASYNC FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL FUNCTIONS
	// ======================================
	
function restoreHighlightScheme(){
    const saved = localStorage.getItem(HIGHLIGHT_KEY);
    if(!saved || !highlightSelector) return;

    highlightSelector.value = saved;
}
// ==============================
// BUILD HTML
// ==============================
function buildTextHTML(text, scheme){
    const size =
        getComputedStyle(document.documentElement)
            .getPropertyValue("--font-size");
    const content =
        text && text.trim()
            ? escapeHTML(text)
            : `
                <div style="
                    border:2px dashed #666;
                    padding:1em;
                    color:#aaa;
                ">
                    EMPTY FRAME
                </div>
            `;
    return TEMPLATE_HTML
        .replaceAll("__FONT_SIZE__", size)
        .replaceAll("__HIGHLIGHT_BG__", scheme.bg)
        .replaceAll("__HIGHLIGHT_TEXT__", scheme.text)
        .replace("__CONTENT__", content);
}
// ==============================
// HTML ESCAPE
// ==============================
function escapeHTML(str){
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}
// ==============================
// HIGHLIGHT SCHEME
// ==============================
function getHighlightScheme(highlightSchemes) {
    const selected =
        document.getElementById("highlightSelector")?.value;
    const scheme =
        (highlightSchemes && highlightSchemes[selected]) || {
            bg: "#000",
            text: "#fff"
        };
    return scheme;
}
// ==============================
// LOAD CONTENT
// ==============================
function setIframeContent(iframe, text, scheme) {
    iframe.srcdoc = buildTextHTML(text, scheme);
}
// ==============================
// Handle Iframe Error
// ==============================
function handleIframeError(err, iframe) {
    console.error(err);
    iframe.srcdoc = buildTextHTML(
        "ERROR",
        {
            bg: "#400",
            text: "#fff"
        }
    );
}
// DO NOT MODIFY ABOVE UNTIL WORKING
function normalizeFileKey(file) {
    return file.replace(/^\.\//, "");
}
// ==============================
// LOAD SCROLL STORE
// ==============================
function loadScrollStore() {
    try {
        return JSON.parse(
            localStorage.getItem(
                SCROLL_STORE_KEY
            )
        ) || {};
    } catch {
        return {};
    }
}
// ==============================
// SAVE SCROLL STORE
// ==============================
function saveScrollStore(store) {
    localStorage.setItem(
        SCROLL_STORE_KEY,
        JSON.stringify(store)
    );
}
// ==============================
// SAVE LAST OPENED FILE
// ==============================
function saveLastOpenedFile(
    frameId,
    file
) {
    let store;
    try {
        store =
            JSON.parse(
                localStorage.getItem(
                    LAST_OPENED_KEY
                )
            ) || {};
    } catch {
        store = {};
    }
    store[frameId] = file;
    localStorage.setItem(
        LAST_OPENED_KEY,
        JSON.stringify(store)
    );
}
// ==============================
// LOAD LAST OPENED FILES
// ==============================
function loadLastOpenedFiles() {
    try {
        return JSON.parse(
            localStorage.getItem(
                LAST_OPENED_KEY
            )
        ) || {};
    } catch {
        return {};
    }
}
// ==============================
// RESTORE SCROLL Position 
// ==============================
function restoreScrollPosition(frameId, iframe) {
    const file = currentFiles[frameId];
    if (!file) {
        console.log("[RESTORE BLOCKED] No file for", frameId);
        return;
    }
	// rev 13 drop in
	// ==============================
	// LOAD STORE
	// ==============================
	const store =
		loadScrollStore();
	const entry =
		store?.[frameId]?.[file];
	if (!entry) {
		console.log(
			"[RESTORE SKIPPED]",
			file
		);
		return;
	}
	const scrollY =
		Number(entry.y);
	if (isNaN(scrollY)) {
		console.log(
			"[RESTORE FAILED]",
			file
		);
		return;
	}
    const iframeWindow = iframe.contentWindow;
    // ensure layout is ready
    setTimeout(() => {
        iframeWindow.scrollTo(0, scrollY);

        console.log(
            "[RESTORED]",
            frameId,
            file,
            scrollY
        );
    }, 0);
}
// ==============================
// ATTACH SCROLL TRACKER TO ANY FRAME
// ==============================
function attachScrollTracking(frameId) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe) return;
    // ONE persistent load handler
    	iframe.onload = () => {
		console.log(
			frameId + " LOADED"
		);
		const iframeWindow =
			iframe.contentWindow;
		// current file for this frame
		const file =
			currentFiles[frameId];
		let scrollTimeout;
		// ONE scroll handler
		iframeWindow.onscroll = () => {
			clearTimeout(
				scrollTimeout
			);
			scrollTimeout =
				setTimeout(() => {
					if (!file)
						return;
					// ==============================
					// LOAD STORE
					// ==============================
					const store =
						loadScrollStore();
					// ensure frame exists
					if (!store[frameId]) {
						store[frameId] = {};
					}
					// ==============================
					// SAVE POSITION
					// ==============================
					store[frameId][file] = {
						y: iframeWindow.scrollY,
						time: Date.now()
					};
					// ==============================
					// LIMIT HISTORY
					// keep newest 500
					// ==============================
					const entries =
						Object.entries(store[frameId]);
					if (entries.length > MAX_SCROLL_HISTORY) {
						entries.sort(
							(a, b) =>
								b[1].time - a[1].time
						);
						store[frameId] =
							Object.fromEntries(
								entries.slice(
									0,
									MAX_SCROLL_HISTORY
								)
							);
					}
					// ==============================
					// SAVE STORE
					// ==============================
					saveScrollStore(store);
				}, 100);
		};
		// restore scroll
		restoreScrollPosition(
			frameId,
			iframe
		);
		// update title
		updateIframeTitle(
			frameId,
			file
		);
	};
}
// ==============================
// SCROLL SAVE FUNCTION
// ==============================
function saveScrollPosition(frameId, scrollY) {
    const file =
        currentFiles[frameId];
    console.log(
        "[SCROLL SAVE TRIGGERED]",
        "frame:",
        frameId,
        "file:",
        file,
        "scrollY:",
        scrollY
    );
    if (!file) {
        console.log(
            "[SCROLL SAVE BLOCKED] No file for",
            frameId
        );
        return;
    }
    savedScrollPositions[file] =
        scrollY;
    console.log(
        "[SCROLL SAVED]",
        file,
        "=>",
        savedScrollPositions[file]
    );
}
// ==============================
// UPDATE IFRAME TITLE
// ==============================
function updateIframeTitle(frameId, filePath){
    const titleMap = {
        frameB: "titleB",
        frameC: "titleC",
        frameD: "titleD",
        frameE: "titleE"
    };
    const titleBar =
        document.getElementById(titleMap[frameId]);
    if(!titleBar) return;
    const fileName =
        filePath.split("/").pop();
    titleBar.textContent =
        fileName;
}
// ==============================
// UPDATE IFRAME FONT SIZE
// ==============================
function updateIframeFonts(){
    ["frameB","frameC","frameD","frameE"].forEach(function(id){
        const iframe = document.getElementById(id);
        try{
            const doc = iframe.contentDocument ||
                        iframe.contentWindow.document;
            if(doc && doc.body){
                doc.body.style.fontSize =
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--font-size");
            }
        } catch(e){}
    });
}
// ==========================================
// SIMPLE TREE FORMAT
// ==========================================
// ==========================================
// RECURSIVE BUILDER
// ==========================================
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
// ==========================================
// BUILD NAV
// ==========================================
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
// ==============================
// DEFAULT LOADS
// ==============================
function loadtheTextFiles () {
	loadTextFile(
		"frameB",
		lastOpened.frameB ||
		"./General Sources/Introduction"
	);
	loadTextFile(
		"frameC",
		lastOpened.frameC ||
		"./WEB/Gospel/John"
	);
	loadTextFile(
		"frameD",
		lastOpened.frameD ||
		"./WEB/Prophets/Revelation"
	);
	loadTextFile(
		"frameE",
		lastOpened.frameE ||
		"./General Sources/Resources"
	);
}
// ======================================
// INITIALIZE ALL 4 SEARCHES
// ======================================
function exeIframeSearch(){
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
}
	// ======================================
	// END GENERAL FUNCTIONS
	// ======================================
	// ======================================
	// BEGIN GENERAL EXECUTION
	// ======================================
document.addEventListener("DOMContentLoaded", init);
function init() {

    console.log("APP INIT");
	scriptLoaded();
	setupNavControlsToggle();
	setupSearchToggle();
	setupGoToggle();
	setupFileLinks();
    setupLayoutToggle();
	restoreHighlightScheme();
	buildNavNew();
	toggleNav();
    loadtheTextFiles ();
    applyLayoutMode();
	exeIframeSearch()
}
// ==============================
// SAVE HIGHLIGHT SELECTION
// ==============================
if(highlightSelector){
    highlightSelector.addEventListener(
        "change",
        function(){
            localStorage.setItem(
                HIGHLIGHT_KEY,
                this.value
            );
            // reload all frames
            ["frameB","frameC","frameD","frameE"]
                .forEach(frameId => {
                    const file =
                        currentFiles[frameId];
                    if(file){
                        loadTextFile(
                            frameId,
                            file
                        );
                    }
                });
        }
    );
}

// ==============================
// APPLY TO ALL FRAMES
// ==============================
["frameB", "frameC", "frameD","frameE"]
    .forEach(attachScrollTracking);
// ==============================
// RESTORE SAVED FONT SIZE
// ==============================
if(savedFontSize){
	document.documentElement
		.style.setProperty(
			"--font-size",
			savedFontSize
		);
	if(fontSelector){
		fontSelector.value =
			savedFontSize;
	}
}
// ==============================
// FONT SELECTOR CHANGE
// ==============================
if(fontSelector){
	fontSelector.addEventListener(
		"change",
		function(){
			document.documentElement
				.style.setProperty(
					"--font-size",
					this.value
				);
			// save font
			localStorage.setItem(
				FONT_SIZE_KEY,
				this.value
			);
			updateIframeFonts();
		}
	);
}
// apply immediately
	// ======================================
	// END GENERAL EXECUTION
	// ======================================
