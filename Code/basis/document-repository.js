import {
    FileService
} from "./file-service.js";
export const DocumentRepository = {
    async fetch(file) {

        return FileService.get(
            file
        );
    },
    async preload(files) {
        return Promise.all(
            files.map(
                file =>
                    this.fetch(file)
            )
        );
    },
    async exists(file) {
        try {
            await this.fetch(file);
            return true;
        }
        catch {

            return false;
        }
    }
};
