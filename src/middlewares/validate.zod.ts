// src/middleware/validate.ts
import type { ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body); // parses & validates
            next();
        } catch (err: any) {
            return res.status(400).json({
                message: "Validation error",
                errors: err.errors || err.message,
            });
        }
    };
