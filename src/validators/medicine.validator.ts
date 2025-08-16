import { z } from "zod";
import { imageSchema } from "./shared/imageSchema";

// add medicine schema
const addMedicineSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.coerce.number().min(0, "Price must be at least 0"),
    stock: z.coerce.number().min(0, "Stock must be at least 0"),
    dosage: z.string().min(2, "Dosage must be at least 2 characters"),
    category: z.enum(["Tablet", "Capsule", "Syrup", "Injection"]),
    image: imageSchema.optional(),
    supplierID: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid supplier ID")
        .optional(), // Mongo ObjectId
});

// update medicine schema
const updateMedicineSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    price: z.coerce.number().min(0, "Price must be at least 0").optional(),
    stock: z.coerce.number().min(0, "Stock must be at least 0").optional(),
    dosage: z
        .string()
        .min(2, "Dosage must be at least 2 characters")
        .optional(),
    category: z.enum(["Tablet", "Capsule", "Syrup", "Injection"]).optional(),
    image: imageSchema.optional(),
    supplierID: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid supplier ID")
        .optional(), // Mongo ObjectId
});

export { addMedicineSchema, updateMedicineSchema };

export type AddMedicine = z.infer<typeof addMedicineSchema>;
export type UpdateMedicine = z.infer<typeof updateMedicineSchema>;
