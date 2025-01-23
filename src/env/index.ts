import * as dotenv from 'dotenv';
import { z } from "zod";

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    API_PORT: z.coerce.number().default(5001),
    API_HOST: z.string().default("localhost"),
    DB_HOST: z.string().default("postgres"),
    DB_PORT: z.coerce.number().default(5432),
    DB_DRIVER: z.string().default("postgres"),
    DB_NAME: z.string().default("mypg"),
    DB_USER: z.string().default("myuser"),
    DB_PASSWORD: z.string().default("myPas$w0rd"),
    ALLOWED_ORIGINS: z.string().default("*"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error("❌ Invalid environment variables", _env.error.format());

    throw new Error("Invalid environment variables.");
}

export const env = _env.data;
