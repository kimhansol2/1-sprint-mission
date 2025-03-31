import path from "path";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = path.resolve("public");
export const STATIC_PATH = "/uploads";
