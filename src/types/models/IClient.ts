import { Document } from "mongoose";
import type { IImage } from "../shared/IImage";

interface IClientBase extends Document {
    fullName: string;
    contact: string;
    avatar?: IImage;
    email?: string;
}

export interface IClient extends IClientBase {
    createdAt: Date;
    updatedAt: Date;
}
