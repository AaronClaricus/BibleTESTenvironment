
import {
    LAST_OPENED_KEY,
    SCROLL_STORE_KEY
} from "./constants.js";

// ======================================
// STORAGE SYSTEM
// ======================================
export const AppStorage = {
	// ==============================
	// GENERIC GET
	// ==============================
	get(
		key,
		fallback = null
	){
		try{
			const value =
				localStorage.getItem(key);
			if(value === null){
				return fallback;
			}
			return JSON.parse(value);
		}catch(err){
			console.error(
				"[STORAGE GET ERROR]",
				key,
				err
			);
			return fallback;
		}
	},
	// ==============================
	// GENERIC SET
	// ==============================
	set(
		key,
		value
	){
		try{
			localStorage.setItem(
				key,
				JSON.stringify(value)
			);
		}catch(err){
			console.error(
				"[STORAGE SET ERROR]",
				key,
				err
			);
		}
	},
	// ==============================
	// REMOVE
	// ==============================
	remove(key){
		try{
			localStorage.removeItem(key);
		}catch(err){
			console.error(
				"[STORAGE REMOVE ERROR]",
				key,
				err
			);
		}
	},
	// ==============================
	// CLEAR
	// ==============================
	clear(){
		try{
			localStorage.clear();
		}catch(err){
			console.error(
				"[STORAGE CLEAR ERROR]",
				err
			);
		}
	},
	// ==============================
	// SETTINGS
	// ==============================
	settings: {
		load(fallback = {}){
			return AppStorage.get(
				"settings",
				fallback
			);
		},
		save(settings){
			AppStorage.set(
				"settings",
				settings
			);
		}
	},
	// ==============================
	// LAST OPENED FILES
	// ==============================
	lastOpened: {
		load(){
			return AppStorage.get(
				LAST_OPENED_KEY,
				{}
			);
		},
		save(store){
			AppStorage.set(
				LAST_OPENED_KEY,
				store
			);
		},
		setFile(
			frameId,
			file
		){
			const store =
				this.load();
			store[frameId] =
				file;
			this.save(store);
		}
	},
	// ==============================
	// SCROLL STORE
	// ==============================
	scroll: {
		load(){
			return AppStorage.get(
				SCROLL_STORE_KEY,
				{}
			);
		},
		save(store){
			AppStorage.set(
				SCROLL_STORE_KEY,
				store
			);
		}
	}
};

