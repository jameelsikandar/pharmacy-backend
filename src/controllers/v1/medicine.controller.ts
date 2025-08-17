import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Medicine } from "../../models/medicine.model";
import type { AddMedicine, UpdateMedicine } from "../../validators/medicine.validator";
import { ApiResponse } from "../../utils/ApiResponse";
import { addMedicineSchema, updateMedicineSchema } from "../../validators/medicine.validator";
import { validateDto } from "../../utils/validateDto";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { ApiError } from "../../utils/ApiError";
import fs from "fs/promises";
import { asyncHandler } from "../../utils/asyncHandler";
import type { AuthenticatedRequest } from "../../types/shared/IAuthenticatedRequest";

// get all medicines
const listMedicines = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    return new ApiResponse(
        200,
        { "Medicines: ": medicines },
        "Medicines fetched successfully!",
    ).send(res);
});

//  add medicine to db
const addMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateDto<AddMedicine>(addMedicineSchema, req.body);

    const uniqueQuery = {
        fullName: data.fullName,
        category: data.category,
        dosage: data.dosage,
        supplierID: data.supplierID,
    };

    const exists = await Medicine.exists(uniqueQuery);

    if (exists && req.file?.path) {
        await fs
            .unlink(req.file.path)
            .catch((err) => console.error(`Failed to delete file: ${err.message}`));
        throw new ApiError(409, "Medicine already exists");
    }

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Image uploading to cloudinary failed!");
        }

        data.image = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };
    }

    const medicine = await Medicine.create(data);

    return new ApiResponse(201, medicine, "Medicine added successfully!").send(res);
});

// update medicine datails
const updateMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { medicineID } = req.params;

    const data = validateDto<UpdateMedicine>(updateMedicineSchema, req.body);

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Image uploading to cloudinary failed!");
        }

        data.image = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };

        await fs.unlink(req.file.path).catch((err) => {
            console.log("Error while deleting file from server", err);
        });
    }

    try {
        const medicine = await Medicine.findByIdAndUpdate(medicineID, data, {
            new: true,
            runValidators: true,
        });

        if (!medicine) {
            throw new ApiError(404, "Failed to update medicine");
        }

        return new ApiResponse(200, data, "Medicine updated successfully!").send(res);
    } catch (error: any) {
        if (error.code === 11000) {
            throw new ApiError(
                409,
                "Medicine with same name, category, dosage and supplier already exists!",
                error.keyValue,
            );
        }
        throw error;
    }
});

// get medicine details by id
const getMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { medicineID } = req.params;

    if (!medicineID || !mongoose.isValidObjectId(medicineID)) {
        throw new ApiError(400, "Invalid medicine ID");
    }

    const medicine = await Medicine.findById(medicineID);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    return new ApiResponse(200, medicine, "Medicine fetched successfully!").send(res);
});

// delete medicine
const deleteMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { medicineID } = req.params;

    if (!medicineID || !mongoose.isValidObjectId(medicineID)) {
        throw new ApiError(400, "Invalid medicine ID");
    }

    const medicine = await Medicine.findByIdAndDelete(medicineID);

    if (!medicine) {
        throw new ApiError(404, "Medicine not found");
    }

    return new ApiResponse(
        200,
        {
            fullName: medicine.fullName,
            category: medicine.category,
            image: medicine.image?.secure_url,
        },
        "Medicine deleted successfully!",
    ).send(res);
});

export { listMedicines, addMedicine, updateMedicine, getMedicine, deleteMedicine };
