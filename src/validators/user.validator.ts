import { z } from "zod";

const registerUserSchema = z.object({
    fullName: z.string().min(2, "Name must be atleast 2 characters long"),
    avatar: z.url("Must be valid avatar url").optional(),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
    contact: z.string().optional(),
});

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string(),
});

export { registerUserSchema, loginSchema };
