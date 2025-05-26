import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { Request, Response } from 'express';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.diskStorage({
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
  if (!req.file) {
    res.status(400).send({ error: 'No file uploaded' });
    return;
  }
  const host = req.get('host');
  const filePath = path.join(STATIC_PATH, req.file.filename);
  const url = `http://${host}${filePath}`;
  res.send({ url });
}
