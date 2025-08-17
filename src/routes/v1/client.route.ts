import { Router } from "express";
import { addClient } from "../../controllers/v1/client.controller";
import { upload } from "../../middlewares/shared/multer.middleware";
import { authGuard } from "../../middlewares/v1/auth.guard";

const router = Router();

// add client
router.route("/add").post(authGuard, upload.single("avatar"), addClient);

export default router;
