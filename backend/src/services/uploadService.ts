import Upload, { IUpload } from '../models/uploadModel.js';
import axios from 'axios';

interface SaveMetadataProps {
  userId: string;
  file: Express.Multer.File;
  objectName: string;
  bucketName: string;
}

async function getAIInsights(objectName: string, bucketName: string) {
  const res = await axios.post('http://localhost:8001/process', {
    objectName,
    bucketName,
  });
  return res.data; // { summary, labels, scores }
}

export const saveUploadMetadata = async ({
  userId,
  file,
  objectName,
  bucketName,
}: SaveMetadataProps): Promise<IUpload> => {
  try {
    const insights = await getAIInsights(objectName, bucketName);

    const newUpload = new Upload({
      userId,
      filename: file.originalname,
      objectName,
      bucketName,
      summary: insights.summary,
      classification: insights.labels, // You may store top 1 or array
    });

    return await newUpload.save();
  } catch (err) {
    console.error('AI processing failed:', err);
    throw err;
  }
};
