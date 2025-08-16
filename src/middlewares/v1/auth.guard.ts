import type { Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { User } from "../../models/user.models";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import type { AuthenticatedRequest } from "../../types/shared/IAuthenticatedRequest";

const authGuard = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const jwt = req.cookies.token;

        if (!jwt) {
            throw new ApiError(400, "No token found!");
        }

        const decoded = verifyToken(jwt);

        if (!decoded) {
            throw new ApiError(401, "Invalid token");
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = {
            _id: user._id,
            fullName: user.fullName,
            avatar: user.avatar,
            contact: user.contact,
            email: user.email,
        };

        next();
    }
);

export { authGuard };
