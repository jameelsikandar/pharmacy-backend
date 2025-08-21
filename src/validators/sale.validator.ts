import { z } from "zod";

// sale item schema
const saleItemSchema = z.object({
    medicineId: z.string().trim(),
    quantity: z.number().min(1),
});

// add sale
const addSaleSchema = z.object({
    clientId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional(),
    fullName: z.string().min(1),
    contact: z.string(),
    email: z.email().optional(),
    items: z.array(saleItemSchema).min(1),
});

export { addSaleSchema };
export type AddSale = z.infer<typeof addSaleSchema>;
