import path from 'path';
import dotenv from 'dotenv';

const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envPath });

if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_TOKEN_SECRET  환경 변수가 설정되지 않았습니다.');
}

if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_REFRESH_TOKEN_SECRET  환경 변수가 설정되지 않았습니다.');
}

export const ACCESS_TOKEN_COOKIE_NAME: string = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME: string = 'refreshToken';
export const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const PUBLIC_PATH: string = path.resolve('public');
export const STATIC_PATH: string = '/uploads';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;
export const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-2';
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
export const BASE_URL = process.env.BASE_URL!;
