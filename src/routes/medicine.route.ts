import express, { Router } from "express";
import { addMedicine } from "../controllers/medicine.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.zod";
import { addMedicineSchema } from "../validators/medicine.validator";

const router = Router();

router
    .route("/add-medicine")
    .post(verifyJWT, validate(addMedicineSchema), addMedicine);

export default router;
