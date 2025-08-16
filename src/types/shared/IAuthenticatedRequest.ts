import type { Request } from "express";
import { Types } from "mongoose";
import type { IImage } from "./IImage";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        fullName: string;
        email: string;
        avatar?: IImage;
        contact?: string;
    };
}
