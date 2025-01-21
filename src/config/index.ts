export * from "./compression";
export * from "./cors";
export * from "./database";
export * from "./helmet";
export * from "./logger";
export * from "./swagger";

import * as dotenv from 'dotenv';

dotenv.config()

export const db_host = String(process.env.DB_HOST);
export const db_port = Number(process.env.DB_PORT);
export const db_driver = String(process.env.DB_DRIVER);
export const db_name = String(process.env.DB_NAME);
export const db_user = String(process.env.DB_USER);
export const db_password = String(process.env.DB_PASSWORD);

// api port
export const api_port = Number(process.env.API_PORT);
export const mode_env = String(process.env.MODE_ENV);
