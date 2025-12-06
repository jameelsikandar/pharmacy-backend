import { Router } from "express";
import {
    addClient,
    updateClient,
    getClient,
    deleteClient,
    listClients,
} from "../../controllers/v1/client.controller";
import { safeUpload } from "../../middlewares/shared/multer.middleware";
import { authGuard } from "../../middlewares/v1/auth.guard";

const router = Router();

// get all clients
router.route("/list-clients").get(authGuard, listClients);

// add client
router.route("/add").post(authGuard, safeUpload, addClient);

// update client
router.route("/update/:clientID").patch(authGuard, safeUpload, updateClient);

// get client
router.route("/client/:clientID").get(authGuard, getClient);

//delete client
router.route("/delete/:clientID").delete(authGuard, deleteClient);

export default router;
