// src/services/documentService.ts
import api from './api';
import { DocumentMeta } from '../types/Document';

export const fetchUserDocuments = async (): Promise<DocumentMeta[]> => {
  const res = await api.get<DocumentMeta[]>('/documents');
  return res.data;
};


export const deleteDocumentById = async (id: string): Promise<void> => {
  await api.delete(`/documents/${id}`);
};

export const uploadDocument = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};