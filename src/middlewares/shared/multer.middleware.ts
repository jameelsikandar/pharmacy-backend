import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { ALLOWED_IMAGE_TYPES } from "../../constants/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "../../../public/temp"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // .jpg, .png, etc.
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const ext = path
        .extname(file.originalname)
        .toLocaleLowerCase()
        .replace(".", "");
    if (ALLOWED_IMAGE_TYPES.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed ${ext}`));
    }
};

export const upload = multer({
    storage,
    fileFilter,
});
