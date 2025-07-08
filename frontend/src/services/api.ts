import { DocumentMeta } from "src/types/Document";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/", // adjust to your backend API root
});

// Optional: Set token on each request if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// src/services/api.ts (append this function)
export const getDocuments = async () => {
  const res = await api.get<DocumentMeta[]>("/documents");
  return res.data;
};


export default api;
