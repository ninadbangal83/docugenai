import mongoose, { Document, Schema } from 'mongoose';

export interface IUpload extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  objectName: string;
  bucketName: string;
  uploadedAt: Date;
  summary?: string; // ✅ ADD THIS
  classification?: string[]; // ✅ ADD THIS
}

const uploadSchema = new Schema<IUpload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    objectName: {
      type: String,
      required: true,
    },
    bucketName: {
      type: String,
      required: true,
    },
    summary: {
      type: String, // ✅ NEW FIELD
    },
    classification: {
      type: [String], // ✅ NEW FIELD
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Upload = mongoose.model<IUpload>('Upload', uploadSchema);
export default Upload;
