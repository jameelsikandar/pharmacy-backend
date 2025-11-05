import mongoose, { Types, Document } from "mongoose";
import type { IImage } from "../shared/IImage";

type MedicineCategory = "Tablet" | "Capsule" | "Syrup" | "Injection";

interface IMedicineBase extends Document {
    _id: mongoose.Types.ObjectId;
    fullName: string;
    price: number;
    stock: number;
    dosage: string;
    category: MedicineCategory;
    image?: IImage;
    supplierID?: Types.ObjectId;
}

export interface IMedicine extends IMedicineBase {
    createdAt: Date;
    updatedAt: Date;
}
