export interface DocumentMeta {
  _id: string;
  filename: string;
  minioUrl: string;
  uploadedAt: string;
  status: "pending" | "processing" | "processed";
  type: "pdf" | "docx" | "image";
  summary?: string;
  classification?: string[];
}
