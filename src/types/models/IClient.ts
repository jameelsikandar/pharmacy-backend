import mongoose, { Document } from "mongoose";
import type { IImage } from "../shared/IImage";

interface IClientBase extends Document {
    _id: mongoose.Types.ObjectId;
    fullName: string;
    contact: string;
    avatar?: IImage;
    email?: string;
}

export interface IClient extends IClientBase {
    createdAt: Date;
    updatedAt: Date;
}
