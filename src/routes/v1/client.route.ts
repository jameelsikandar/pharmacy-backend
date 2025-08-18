import { Router } from "express";
import {
    addClient,
    updateClient,
    getClient,
    deleteClient,
} from "../../controllers/v1/client.controller";
import { upload } from "../../middlewares/shared/multer.middleware";
import { authGuard } from "../../middlewares/v1/auth.guard";

const router = Router();

// add client
router.route("/add").post(authGuard, upload.single("avatar"), addClient);

// update client
router.route("/update/:clientID").patch(authGuard, upload.single("avatar"), updateClient);

// get client
router.route("/client/:clientID").get(authGuard, getClient);

//delete client
router.route("/delete/:clientID").delete(authGuard, deleteClient);

export default router;
