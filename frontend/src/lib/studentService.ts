import api from "./api";

export interface Student {
  id?: number;
  name: string;
  email: string;
  dateOfBirth: string;
  address: string;
  course?: { id: number; name?: string } | null;
}

export const getStudents = async () => {
  const response = await api.get<Student[]>("/students");
  return response.data;
};

export const getStudentById = async (id: number) => {
  const response = await api.get<Student>(`/students/${id}`);
  return response.data;
};

export const createStudent = async (student: Student) => {
  const response = await api.post<Student>("/students", student);
  return response.data;
};

export const updateStudent = async (id: number, student: Student) => {
  const response = await api.put<Student>(`/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
