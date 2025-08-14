import type { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
    name: string;
    email: string;
    address: string;
    avatar: string;
    licenseNumber: string;
    contact: string;
    createdAt: Date;
    updatedAt: Date;
}
