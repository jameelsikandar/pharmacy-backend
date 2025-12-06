import express, { Router } from "express";
import { authGuard } from "../../middlewares/v1/auth.guard";
import {
    listMedicines,
    addMedicine,
    updateMedicine,
    getMedicine,
    deleteMedicine,
} from "../../controllers/v1/medicine.controller";
import { safeUpload } from "../../middlewares/shared/multer.middleware";

const router = Router();

// ------- protected troutes --------

// get all medicines
router.route("/list-medicines").get(authGuard, listMedicines);

//add medicine
router.route("/add-medicine").post(authGuard, safeUpload, addMedicine);

// update medicine
router.route("/update/:medicineID").patch(authGuard, safeUpload, updateMedicine);

// get medicine details by id
router.route("/profile/:medicineID").get(authGuard, getMedicine);

// delete medicine
router.route("/delete/:medicineID").delete(authGuard, deleteMedicine);

export default router;
