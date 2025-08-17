import type { Schema, Document } from "mongoose";
import type { IImage } from "../shared/IImage";

export interface ISupplier extends Document {
    fullName: string;
    email: string;
    address: string;
    avatar: IImage;
    licenseNumber: string;
    contact: string;
    createdAt: Date;
    updatedAt: Date;
}
