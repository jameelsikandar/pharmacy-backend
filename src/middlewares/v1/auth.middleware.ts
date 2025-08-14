import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../utils/jwt";
import { User } from "../../models/user.models";
import { ENV } from "../../config/env.config";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

const verifyJWT = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token =
            req.cookies?.token ||
            (req.headers.authorization?.startsWith("Bearer ") &&
                req.headers.authorization.split(" ")[1]);

        if (!token) {
            throw new ApiError(401, "no token");
        }

        try {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                throw new ApiError(401, "User not found");
            }

            req.user = { id: user._id.toString(), ...user.toObject() };

            next();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error; // Re-throw ApiError as-is
            }
            throw new ApiError(
                401,
                `Token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }
);

export { verifyJWT };
