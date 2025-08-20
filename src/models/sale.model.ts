import mongoose, { Schema } from "mongoose";
import type { ISale } from "../types/models/ISale";

const saleSchema = new Schema<ISale>(
    {
        clientId: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            default: null,
        },
        receiptNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        items: [
            {
                medicineId: {
                    type: Schema.Types.ObjectId,
                    ref: "Medicine",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                priceAtSale: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        total: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    },
);

export const Sale = mongoose.model<ISale>("Sale", saleSchema);
