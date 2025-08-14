import { Document, Types } from "mongoose";

interface IUserBase extends Document {
    _id: Types.ObjectId;
    fullName: string;
    avatar?: string;
    email: string;
    password: string;
    contact?: string;
}

export interface IUser extends IUserBase {
    createdAt: Date;
    updatedAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}
