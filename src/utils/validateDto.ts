import type { ZodSchema } from "zod";
import { ApiError } from "./ApiError";

export function validateDto<T>(schema: ZodSchema<T>, data: unknown): T {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        throw new ApiError(400, "Validation failed", errors);
    }

    return parsed.data;
}
