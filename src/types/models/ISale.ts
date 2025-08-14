import { Document, Types } from "mongoose";

export interface ISaleItem {
    medicineId: Types.ObjectId;
    quantity: number;
    priceAtSale: number;
}

export interface ISale extends Document {
    clientId: Types.ObjectId | null;
    items: ISaleItem[];
    total: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}
