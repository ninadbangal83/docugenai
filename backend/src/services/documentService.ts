import { Types } from "mongoose";
import Upload, { IUpload } from "../models/uploadModel.js";
import axios from "axios";
import { removeFromMinIO } from "./minioService.js";

interface SaveMetadataProps {
  userId: string;
  file: Express.Multer.File;
  objectName: string;
  bucketName: string;
}

async function getAIInsights(objectName: string, bucketName: string) {
  const res = await axios.post("http://ai-service:8001/process", {
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

    console.log(insights)
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
    console.error("AI processing failed:", err);
    throw err;
  }
};

export const getDocumentsByUserId = async (userId: Types.ObjectId) => {
  return await Upload.find({ userId }).sort({ createdAt: -1 });
};

export const deleteDocumentById = async (id: string) => {
  const doc = await Upload.findById(id);
  if (!doc) {
    throw new Error("Document not found");
  }

  await removeFromMinIO(doc.bucketName, doc.objectName);
  await doc.deleteOne();
  return doc;
};

export const deleteUserUploads = async (userId: string) => {
  const uploads = await Upload.find({ userId });

  for (const doc of uploads) {
    try {
      await removeFromMinIO(doc.bucketName, doc.objectName);
    } catch (err) {
      console.error(`Failed to remove from MinIO: ${doc.objectName}`, err);
    }

    try {
      await doc.deleteOne();
    } catch (err) {
      console.error(`Failed to delete document ${doc._id} from DB`, err);
    }
  }
};



