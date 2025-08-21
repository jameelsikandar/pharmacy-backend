import type { AuthenticatedRequest } from "../../types/shared/IAuthenticatedRequest";
import type { Response } from "express";
import type { AddSale } from "../../validators/sale.validator";
import { addSaleSchema } from "../../validators/sale.validator";
import { Sale } from "../../models/sale.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Medicine } from "../../models/medicine.model";
import { validateDto } from "../../utils/validateDto";
import { Client } from "../../models/client.model";
import mongoose, { Types } from "mongoose";
import type { ISaleItem } from "../../types/models/ISale";

// add sale
const addSale = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateDto<AddSale>(addSaleSchema, req.body);

    let clientId = data.clientId || null;

    if (!clientId && data.fullName) {
        // Check if client already exists by contact (to avoid duplicate)
        let existingClient = null;
        if (data.contact) {
            existingClient = await Client.findOne({ contact: data.contact });
        }

        if (existingClient) {
            clientId = (existingClient._id as Types.ObjectId).toString();
        } else {
            const newClient = await Client.create({
                fullName: data.fullName,
                contact: data.contact,
                email: data.email, // optional
            });
            clientId = (newClient._id as Types.ObjectId).toString();
        }
    }

    let total: number = 0;

    const itemsToSave: ISaleItem[] = [];

    for (const item of data.items) {
        const medicine = await Medicine.findById(item.medicineId);
        if (!medicine) {
            throw new ApiError(400, "Medicine not found!");
        }

        if (medicine.stock < item.quantity) {
            throw new ApiError(
                400,
                `Not enough stock for ${medicine.fullName}. Available ${medicine.stock}`,
            );
        }

        const priceAtSale = medicine.price;
        total += priceAtSale * item.quantity;

        itemsToSave.push({
            medicineId: medicine._id as Types.ObjectId,
            quantity: item.quantity,
            priceAtSale,
        });

        medicine.stock -= item.quantity;
        await medicine.save();
    }

    const lastSale = await Sale.findOne().sort({ receiptNumber: -1 });
    const receiptNumber = lastSale ? lastSale.receiptNumber + 1 : 1;

    const sale = await Sale.create({
        clientId,
        items: itemsToSave,
        total,
        receiptNumber,
    });

    return new ApiResponse(201, sale, "Sale recorded successfully!").send(res);
});

// get list sales
const listSales = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const sales = await Sale.find().sort({ createdAt: -1 });

    return new ApiResponse(200, sales, "Sales fetched successfully!").send(res);
});

// get sale
const getSale = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { saleID } = req.params;

    if (!saleID || !mongoose.isValidObjectId(saleID)) {
        throw new ApiError(400, "Invalid sale id");
    }

    const sale = await Sale.findById(saleID);

    if (!sale) {
        throw new ApiError(400, "Sale not found!");
    }

    return new ApiResponse(200, sale, "Sale fetched successfully!").send(res);
});

export { addSale, getSale, listSales };
