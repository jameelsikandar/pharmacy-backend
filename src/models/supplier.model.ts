import mongoose, { Schema } from "mongoose";
import type { ISupplier } from "../types/models/ISupplier";

const supplierSchema = new Schema<ISupplier>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        avatar: { type: String, required: false },
        address: { type: String, required: true },
        licenseNumber: { type: String, required: true },
        contact: { type: String, required: true },
    },
    { timestamps: true }
);

export const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);
