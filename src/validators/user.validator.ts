import { z } from "zod";
import { imageSchema } from "./shared/imageSchema";

const registerUserSchema = z.object({
    fullName: z.string().min(2, "Name must be atleast 2 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
    contact: z.string().optional(),
    avatar: imageSchema.optional(),
});

const updateUserSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be atleast 2 characters long")
        .optional(),
    email: z.email("Invalid email address").optional(),
    contact: z.string().optional(),
    avatar: imageSchema.optional(),
});

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string(),
});

export { registerUserSchema, loginSchema, updateUserSchema };

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
