import api from "./api";

export interface User {
  id?: number;
  username: string;
  password: string;
  email: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
}

export const getUsers = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await api.post<User>("/users", user);
  return response.data;
};

export const updateUser = async (id: number, user: User) => {
  const response = await api.put<User>(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
