import mongoose, { Schema } from "mongoose";
import type { IMedicine } from "../types/models/IMedicine";

const medicineSchema = new Schema<IMedicine>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        dosage: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["Tablet", "Capsule", "Syrup", "Injection"],
            required: true,
            trim: true,
        },
        image: {
            public_id: { type: String },
            secure_url: { type: String },
        },
        supplierID: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
        },
    },
    {
        timestamps: true,
    }
);

medicineSchema.index(
    { name: 1, category: 1, dosage: 1, supplierID: 1 },
    { unique: true }
);

export const Medicine = mongoose.model<IMedicine>("Medicine", medicineSchema);
