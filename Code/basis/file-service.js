import {
    ConfigService
} from "./config.js";

export const FileService = {
    _cache: new Map(),
    _order: [],
    async get(file) {
        if (this._cache.has(file)) {
            return this._cache.get(file);
        }
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${file}`);
        }
        const text = await response.text();
        this._cache.set(file, text);
        this._order.push(file);

        if (this._order.length > ConfigService.get(
    "config.cache.maxFiles",
    100
)) {
            const oldest = this._order.shift();
            this._cache.delete(oldest);
        }
        return text;
    }
};
