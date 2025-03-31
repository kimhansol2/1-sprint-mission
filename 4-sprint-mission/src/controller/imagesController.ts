import multer from "multer"; // 파일 업로드를 처리하는 미들웨어
import path from "path";
import { v4 as uuidv4 } from "uuid"; // 고유한 파일명을 위한 uuod 생성
import { PUBLIC_PATH, STATIC_PATH } from "../lib/constants.js"; // 파일 저장 경로
import BadRequestError from "../lib/errors/BadRequestError.js"; // 예외 처리
import { Request, Response } from "express";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpg", "image/jpeg"]; //허용할 파일 형식
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 허용할 파일 크기

export const upload = multer({
  storage: multer.diskStorage({
    //multer가 파일을 디스크(서브의 로컬 스토리지)에 저장하도록 설정하는 메소드
    destination(req, file, cb) {
      // destination (현재 요청 객체, 업로드된 파일 정보 객체, 콜백 함수(저장 경로를 전달))
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 원본 파일의 확장자 추출
      const filename = `${uuidv4()}${ext}`; // uuid _ 확장자로 파일명 설정 filename()은 업로드된 파일을 어떤 이름으로 저장할지 정의
      cb(null, filename); // 파일 이름 저장
    },
  }),

  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },

  //파일 형식 검증
  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      //파일 형식을 확인하여 ALLOWED_MIME_TYPES에 포함하는지 확인
      const err = new BadRequestError("Only png, jpeg, and jpg are allowed");
      return cb(err); //허용되지 않은 파일 형식이면 에러 반환
    }

    cb(null, true); // 허용된 파일 형식이면 업로드 진행
  },
});

export async function uploadImage(req: Request, res: Response) {
  const host = req.get("host"); // 요청한 클라이언트의 도메인(호스트)를 가져옴
  const filePath = path.join(STATIC_PATH, req.file.filename); //업로드된 파일의 경로를 생성
  const url = `http://${host}${filePath}`; //파일 url을 반환 예시(http://localhost:3000/static/uploads/filename.jpg)
  return res.send({ url });
}
