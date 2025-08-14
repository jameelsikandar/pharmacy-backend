import { z } from "zod";

const addMedicineSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.number().min(0, "Price must be at least 0"),
    stock: z.number().min(0, "Stock must be at least 0"),
    dosage: z.string().min(2, "Dosage must be at least 2 characters"),
    category: z.string().min(1, "Category is required"),
    image: z.string().url("Invalid image URL").optional(),
    supplierID: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid supplier ID")
        .optional(), // Mongo ObjectId
});

export { addMedicineSchema };
