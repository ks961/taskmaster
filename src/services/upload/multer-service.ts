import path from "node:path";
import fs from "fs/promises";
import multer, { Multer } from "multer";
import { Request, Response } from "express";
import { ExpressMiddleware, IUpload } from "./interface";
import { PathLike } from "node:fs";

type UploadOptions = {
    destination?: `${string}/`
}

type UploadResult = { exists: boolean, filename?: string };

export class MulterService implements IUpload {
    private uploader: Multer;

    constructor(
        private readonly options?: UploadOptions
    ) {
        const storage = multer.diskStorage({
            destination: this.options?.destination || 'uploads/',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path.extname(file.originalname));
            },
        });

        this.uploader = multer({storage});
    }

    async fileExists(filepath: PathLike) {
        try {
            await fs.access(filepath)
            return true;
        } catch {
            return false;
        }

    }

    async wasSuccess(req: Request, _res: Response): Promise<UploadResult> {
        const filename = req.file?.filename;

        if (!filename) {
            return {
                exists: false
            };
        }

        const filepath = path.join(this.options?.destination || 'uploads/', filename);

        const result = await this.fileExists(filepath);
        return {
            exists: result,
            filename: result ? filename : undefined
        }
    }

    middleware(): ExpressMiddleware {
        return this.uploader.single("file");
    }
}