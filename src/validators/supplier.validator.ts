import { z } from "zod";
import { imageSchema } from "./shared/imageSchema";

// add supliers schema
const addSupplierSchema = z.object({
    fullName: z.string().min(3, "Name must be minimum 3 characters").trim(),
    email: z.email().lowercase().trim(),
    avatar: imageSchema.optional(),
    address: z.string(),
    licenseNumber: z.string(),
    contact: z.string(),
});

// update suppliers schema
const updateSupplierSchema = z.object({
    fullName: z.string().min(3, "Name must be minimum 3 characters").trim().optional(),
    email: z.email().lowercase().trim().optional(),
    avatar: imageSchema.optional(),
    address: z.string().optional(),
    licenseNumber: z.string().optional(),
    contact: z.string().optional(),
});

export { addSupplierSchema, updateSupplierSchema };

export type AddSupplier = z.infer<typeof addSupplierSchema>;
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>;
