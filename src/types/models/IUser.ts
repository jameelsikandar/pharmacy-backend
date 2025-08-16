import { Document, Types } from "mongoose";
import type { IImage } from "../shared/IImage";

interface IUserBase extends Document {
    _id: Types.ObjectId;
    fullName: string;
    avatar?: IImage;
    email: string;
    password: string;
    contact?: string;
}

export interface IUser extends IUserBase {
    createdAt: Date;
    updatedAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}
