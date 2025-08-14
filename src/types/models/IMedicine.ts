import { Types, Document } from "mongoose";

interface IMedicineBase extends Document {
    name: string;
    price: number;
    stock: number;
    dosage: number | string;
    category: string;
    image: string;
    supplierID: Types.ObjectId;
}

export interface IMedicine extends IMedicineBase, Document {
    createdAt: Date;
    updatedAt: Date;
}
