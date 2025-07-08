// src/services/authService.ts

import api from "./api";

interface LoginResponse {
  token: string;
  user: any;
}

interface RegisterResponse {
  token: string;
  newUser: any;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post('/user/login', { email, password });
  return res.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const res = await api.post('/user', { name, email, password });
  return res.data;
};

export const deleteUserById = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`);
};
