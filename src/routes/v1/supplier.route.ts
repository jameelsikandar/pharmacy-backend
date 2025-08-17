import express, { Router } from "express";
import {
    addSupplier,
    updateSupplier,
    getSupplier,
    deleteSupplier,
} from "../../controllers/v1/supplier.controller";
import { authGuard } from "../../middlewares/v1/auth.guard";
import { upload } from "../../middlewares/shared/multer.middleware";

const router = Router();

// add supplier route
router.route("/add").post(authGuard, upload.single("avatar"), addSupplier);

// update supplier
router.route("/update/:supplierID").patch(authGuard, upload.single("avatar"), updateSupplier);

// get supplier details
router.route("/:supplierID").get(authGuard, getSupplier);

//delete supplier
router.route("/delete/:supplierID").delete(authGuard, deleteSupplier);

export default router;
