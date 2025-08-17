import mongoose, { Schema } from "mongoose";
import type { ISupplier } from "../types/models/ISupplier";

const supplierSchema = new Schema<ISupplier>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        avatar: { public_id: { type: String }, secure_url: { type: String } },
        address: { type: String, required: true },
        licenseNumber: { type: String, required: true, unique: true },
        contact: { type: String, required: true },
    },
    { timestamps: true },
);

export const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);
