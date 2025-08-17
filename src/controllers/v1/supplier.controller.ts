import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/shared/IAuthenticatedRequest";
import type { AddSupplier, UpdateSupplier } from "../../validators/supplier.validator";
import { Supplier } from "../../models/supplier.model";
import { addSupplierSchema, updateSupplierSchema } from "../../validators/supplier.validator";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateDto } from "../../utils/validateDto";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import fs from "fs/promises";

// add supplier
const addSupplier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateDto<AddSupplier>(addSupplierSchema, req.body);

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Error while uploading image to cloudinary");
        }

        data.avatar = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };

        await fs.unlink(req.file.path).catch((err) => {
            console.log("Error while deleting image from server: ", err);
        });
    }

    const existingSupplier = await Supplier.findOne({
        $or: [
            {
                email: data.email,
            },
            {
                licenseNumber: data.licenseNumber,
            },
        ],
    });

    if (existingSupplier) {
        throw new ApiError(409, "Supplier already exists");
    }

    const supplier = await Supplier.create(data);

    if (!supplier) {
        throw new ApiError(400, "Error while adding supplier");
    }

    return new ApiResponse(
        201,
        {
            name: supplier.name,
            email: supplier.email,
            contact: supplier.contact,
            avatar: supplier.avatar?.secure_url,
            licenseNumber: supplier.licenseNumber,
            address: supplier.address,
        },
        "Supplier addded successfully!",
    ).send(res);
});

// update supplier
const updateSupplier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateDto<UpdateSupplier>(updateSupplierSchema, req.body);
    const { supplierID } = req.params;

    if (req.file) {
        const response = await uploadToCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            throw new ApiError(400, "Error while uploading image to cloudinary");
        }

        data.avatar = {
            public_id: response.public_id,
            secure_url: response.secure_url,
        };

        await fs.unlink(req.file.path).catch((err) => {
            console.log("Error while deleting image from server: ", err);
        });
    }

    const supplier = await Supplier.findByIdAndUpdate(supplierID, data, {
        new: true,
        runValidators: true,
    });

    if (!supplier) {
        throw new ApiError(404, "Error while updating supplier");
    }

    return new ApiResponse(200, data, "Supplier updated successfully!").send(res);
});

// get supplier details
const getSupplier = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { supplierID } = req.params;

    const supplier = await Supplier.findById(supplierID);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return new ApiResponse(
        200,
        {
            name: supplier.name,
            email: supplier.email,
            avatar: supplier.avatar.secure_url,
            address: supplier.address,
            licenseNumber: supplier.licenseNumber,
        },
        "Supplier fetched successfully!",
    ).send(res);
});

export { addSupplier, updateSupplier, getSupplier };
