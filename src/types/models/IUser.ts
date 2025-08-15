import { Document, Types } from "mongoose";
import type { Avatar } from "../shared/IAvatar";

interface IUserBase extends Document {
    _id: Types.ObjectId;
    fullName: string;
    avatar?: Avatar;
    email: string;
    password: string;
    contact?: string;
}

export interface IUser extends IUserBase {
    createdAt: Date;
    updatedAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}
