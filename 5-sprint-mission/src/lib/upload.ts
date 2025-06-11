import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
//AWS SDK의 S3 클라이언트와 파일 업로드 명령어를 사용하기 위한 임포트
import { v4 as uuidv4 } from 'uuid';
// 고유한 파일명을 만들기 위해 UUID를 사용
import path from 'path';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME } from './constants';
//AWS 인증 정보 및 환경 설정을 상수로 불러온다.
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
}); //AWS S3와 통신할 클라이언트를 생성 REGION, credentials를 설정하여 인증된 상태로 사용

function generateKey(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname);
  return `uploads/${uuidv4()}${ext}`;
} // 파일 이름이 중복되지 않도록 UUID를 사용해서 S3의 파일 키를 생성
// 업로드 폴더 아래에 저장되도록 경로를 지정

export async function uploadImageToS3(file: Express.Multer.File): Promise<string> {
  const key = generateKey(file);
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  // 업로드할 파일을 PutObjectCommand로 감싸 명령 객체를 만든다
  // body는 실제 파일의 바이너리 데이터
  // contentType은 image/jpeg, image/png 같은 mime타입이다.
  try {
    await s3Client.send(command);
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  } catch (err) {
    console.error(err);
    throw new Error('S3 업로드 실패');
  }
}
// s3로 명령을 보내 업로드를 시도하고 성공하면 해당 이미지의 접근 가능한 url을 반환
// 실패하면 에러를 throw하여 에러 처리 로직이 동작
