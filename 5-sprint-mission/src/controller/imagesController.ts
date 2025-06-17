import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, NODE_ENV, BASE_URL } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { Request, Response } from 'express';
import { uploadImageToS3 } from '../lib/upload';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage:
    NODE_ENV === 'production'
      ? multer.memoryStorage()
      : multer.diskStorage({
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
    }

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
      const url = await uploadImageToS3(file);
      res.status(200).json({ url });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'S3 업로드 실패' });
      return;
    }
  }

  const url = `${BASE_URL}/uploads/${file.filename}`;
  res.status(200).send({ url });
  return;
}
