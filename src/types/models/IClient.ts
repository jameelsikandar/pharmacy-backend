import { Document } from "mongoose";

interface IClientBase extends Document {
    name: string;
    phone: string;
    avatar?: string;
    email?: string;
}

export interface IClient extends IClientBase {
    createdAt: Date;
    updatedAt: Date;
}
