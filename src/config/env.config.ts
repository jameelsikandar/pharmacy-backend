import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", debug: true });

// defining schema for env

const envSchema = z.object({
    PORT: z.string().optional().default("8000"),
    NODE_ENV: z.enum(["development", "production"]),
    MONGO_URI: z.url(),
    CORS_ORIGIN: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
});

// parse process env
const _env = envSchema.safeParse(process.env);

// throw error if
// invalid
if (!_env.success) {
    console.log(
        "Invalid environment variables ",
        _env.error.flatten().fieldErrors
    );
    throw new Error("Environment validation failed. Check your .env file");
}

// export
export const ENV = _env.data;
