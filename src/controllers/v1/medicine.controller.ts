import type { Request, Response } from 'express';
import { Medicine } from '../../models/medicine.model';
import type { AddMedicine, UpdateMedicine } from '../../validators/medicine.validator';
import { ApiResponse } from '../../utils/ApiResponse';
import { addMedicineSchema, updateMedicineSchema } from '../../validators/medicine.validator';
import { validateDto } from '../../utils/validateDto';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import { ApiError } from '../../utils/ApiError';
import fs from 'fs';
import { asyncHandler } from '../../utils/asyncHandler';
import type { AuthenticatedRequest } from '../../types/shared/IAuthenticatedRequest';

// get all medicines
const listMedicines = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    return new ApiResponse(
        200,
        { 'Medicines: ': medicines },
        'Medicines fetched successfully!',
    ).send(res);
});

//  add medicine to db
const addMedicine = asyncHandler(async (req: Request, res: Response) => {
    const data = validateDto<AddMedicine>(addMedicineSchema, req.body);

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(500, 'Image uploading to cloudinary failed!');
        }

        data.image = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };

        await fs.unlink(req.file.path, (err) => {
            console.log('Error while deleting image from server: ', err);
        });
    }
    const uniqueQuery = {
        name: data.name,
        category: data.category,
        dosage: data.dosage,
        supplierID: data.supplierID,
    };

    const exists = await Medicine.exists(uniqueQuery);

    if (exists) {
        throw new ApiError(409, 'Medicine already exists!');
    }

    const medicine = await Medicine.create(data);

    return new ApiResponse(201, medicine, 'Medicine added successfully!').send(res);
});

// update medicine datails
const updateMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { medicineID } = req.params;

    const data = validateDto<UpdateMedicine>(updateMedicineSchema, req.body);

    console.log('MEDICINE ID: ', medicineID);
    console.log('DATA: ', data);

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, 'Image uploading to cloudinary failed!');
        }

        data.image = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };

        await fs.unlink(req.file.path, (err) => {
            console.log('Error while deleting file from server ', err);
        });
    }

    try {
        const medicine = await Medicine.findByIdAndUpdate(medicineID, data, {
            new: true,
            runValidators: true,
        });
        console.log('MEDICINE: ', medicine);

        if (!medicine) {
            throw new ApiError(404, 'Failed to update medicine');
        }

        return new ApiResponse(200, medicine, 'Medicine updated successfully!').send(res);
    } catch (error: any) {
        if (error.code === 11000) {
            throw new ApiError(
                409,
                'Medicine with same name, category, dosage and supplier already exists!',
            );
        }
        throw error;
    }
});

// get medicine details by id
const getMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { medicineID } = req.params;

    if (!medicineID) {
        throw new ApiError(400, 'No medicine id.');
    }

    const medicine = await Medicine.findById(medicineID);

    if (!medicine) {
        throw new ApiError(404, 'Medicine not found');
    }

    return new ApiResponse(200, medicine, 'Medicine fetched successfully!').send(res);
});

// delete medicine
const deleteMedicine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { medicineID } = req.params;

    const medicine = await Medicine.findByIdAndDelete(medicineID);

    if (!medicine) {
        throw new ApiError(404, 'Medicine not found');
    }

    return new ApiResponse(
        204,
        {
            'Name: ': medicine.name,
            'Category: ': medicine.category,
            'Image: ': medicine.image?.secure_url,
        },
        'Medicine deleted successfully!',
    ).send(res);
});

export { listMedicines, addMedicine, updateMedicine, getMedicine, deleteMedicine };
