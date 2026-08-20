import api from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export const login = async (credentials: LoginRequest) => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};
