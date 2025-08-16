import type { Request } from "express";
import { Types } from "mongoose";
import type { Avatar } from "./IAvatar";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: Types.ObjectId;
        fullName: string;
        email: string;
        avatar?: Avatar;
        contact?: string;
    };
}
