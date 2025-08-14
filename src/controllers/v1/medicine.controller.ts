// src/controllers/medicine.controller.ts
import type { Request, Response } from "express";
import { Medicine } from "../../models/medicine.model";
import { ApiResponse } from "../../utils/ApiResponse";

export const addMedicine = async (req: Request, res: Response) => {
    try {
        const medicine = await Medicine.create(req.body);
        return new ApiResponse(
            201,
            medicine,
            "Medicine added successfully!"
        ).send(res);
    } catch (error: any) {
        console.error("Error adding medicine:", error);
        return res.status(400).json({ message: error.message });
    }
};
