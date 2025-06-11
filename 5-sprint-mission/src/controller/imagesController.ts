import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, NODE_ENV, BASE_URL } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { Request, Response } from 'express';
import { uploadImageToS3 } from '../lib/upload';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
// 허용할 이미지 타입 설정
// 업로드 최대 용량은 5MB

export const upload = multer({
  storage:
    NODE_ENV === 'production'
      ? multer.memoryStorage() //운영 환경에 사용
      : multer.diskStorage({
          // 개발 환경이면 사용
          destination(req: Request, file: Express.Multer.File, cb: Function) {
            cb(null, PUBLIC_PATH);
          },
          filename(req: Request, file: Express.Multer.File, cb: Function) {
            const ext = path.extname(file.originalname);
            const filename = `${uuidv4()}${ext}`;
            cb(null, filename);
          },
        }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('Only png, jpeg, and jpg are allowed');
      return cb(err);
    } //파일 타입 필터링 PNG, JPG, JPEG만 허용

    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response) {
  const file = req.file;

  if (!file) {
    res.status(400).send({ error: 'No file uploaded' });
    return;
  }

  if (NODE_ENV === 'production') {
    try {
      const url = await uploadImageToS3(file); //S3 업로드
      res.status(200).json({ url }); //S3 URL 반환
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'S3 업로드 실패' });
      return;
    }
  }

  const url = `${BASE_URL}/uploads/${file.filename}`; //개발 환경에서는 로컬에 저장된 이미지 경로를 URL로 반환
  res.status(200).send({ url });
  return;
}
