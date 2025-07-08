import { Client } from 'minio';
import dotenv from 'dotenv';
dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const bucketName = process.env.MINIO_BUCKET!;

export const uploadToMinIO = async (file: Express.Multer.File) => {
  const objectName = `${Date.now()}-${file.originalname}`;

  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName);
  }

  await minioClient.putObject(bucketName, objectName, file.buffer);
  return { objectName, bucketName };
};
