import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME } from './constants';

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

function generateKey(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname);
  return `uploads/${uuidv4()}${ext}`;
}

export async function uploadImageToS3(file: Express.Multer.File): Promise<string> {
  const key = generateKey(file);
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error(err);
    throw new Error('S3 업로드 실패');
  }
}
