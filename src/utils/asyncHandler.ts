import type { Request, Response, NextFunction } from "express";

import { ApiError } from "./ApiError";

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error("Unhandled Error:", err);
            res.status(err.statusCode || 500).json({
                success: false,
                message: err.message || "Internal server error!",
                errors: err.errors || null,
            });
        });
    };
};
