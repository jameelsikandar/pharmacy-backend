import { z } from "zod";

export const imageSchema = z.object({
    public_id: z.string(),
    secure_url: z.url(),
});
