import { Document, Types } from "mongoose";

export interface ISaleItem {
    medicineId: Types.ObjectId;
    quantity: number;
    priceAtSale: number;
}

export interface ISale extends Document {
    clientId: Types.ObjectId | null;
    receiptNumber: number;
    items: ISaleItem[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
}
