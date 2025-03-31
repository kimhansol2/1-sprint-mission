import path from "path";
import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3000;
export const PUBLIC_PATH: string = path.resolve("public");
export const STATIC_PATH: string = "/uploads";
