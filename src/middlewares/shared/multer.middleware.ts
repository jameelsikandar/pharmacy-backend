import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { ALLOWED_IMAGE_TYPES } from "../../constants/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.resolve(__dirname, "../../../public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const DUMMY_FILE_PATH = path.join(tempDir, ".gitkeep");
if (!fs.existsSync(DUMMY_FILE_PATH)) {
    fs.writeFileSync(DUMMY_FILE_PATH, "");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (ALLOWED_IMAGE_TYPES.test(ext)) cb(null, true);
    else cb(new Error(`File type not allowed: ${ext}`));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

// Critical: Replace path ONLY when response is sent
export const safeUpload = (req: any, res: any, next: any) => {
    upload(req, res, (err: any) => {
        if (err) return next(err);
        if (!req.file) return next();

        const realFilePath = req.file.path;

        const originalSend = res.send;
        res.send = function (data: any) {
            req.file.path = DUMMY_FILE_PATH;

            fs.unlink(realFilePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.warn("Cleanup failed:", realFilePath, err);
                }
            });

            // @ts-ignore
            return originalSend.call(this, data);
        };

        next();
    });
};
