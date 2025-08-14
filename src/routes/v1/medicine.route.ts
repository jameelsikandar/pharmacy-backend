import express, { Router } from "express";
import { addMedicine } from "../controllers/v1/medicine.controller";
import { verifyJWT } from "../middlewares/v1/auth.middleware";
import { addMedicineSchema } from "../validators/medicine.validator";

const router = Router();

//add medicine
router.route("/add-medicine").post(verifyJWT, addMedicine);

export default router;
