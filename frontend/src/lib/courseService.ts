import api from "./api";

export interface Course {
  id?: number;
  name: string;
  description: string;
  credits: number;
}

export const getCourses = async () => {
  const response = await api.get<Course[]>("/courses");
  return response.data;
};

export const getCourseById = async (id: number) => {
  const response = await api.get<Course>(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (course: Course) => {
  const response = await api.post<Course>("/courses", course);
  return response.data;
};

export const updateCourse = async (id: number, course: Course) => {
  const response = await api.put<Course>(`/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};
