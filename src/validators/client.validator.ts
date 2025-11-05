import { z } from "zod";
import { imageSchema } from "./shared/imageSchema";

// add clients
const addClientSchema = z.object({
    fullName: z.string().trim(),
    contact: z.string(),
    avatar: imageSchema.optional(),
    email: z.email().toLowerCase().optional(),
});

// update clients
const updateClientSchema = z.object({
    fullName: z.string().trim().optional(),
    contact: z.string().optional(),
    avatar: imageSchema.optional(),
    email: z.email().toLowerCase().optional(),
});

export { addClientSchema, updateClientSchema };

export type AddClient = z.infer<typeof addClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
