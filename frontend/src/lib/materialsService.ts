import api from "./api";

export interface Material {
  id?: number;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  course: {
    id: number;
    name: string;
    description: string;
    credits: number;
  };
  uploadedBy: string;
  uploadedAt: string;
}

export const getMaterialsByCourse = async (courseId: number) => {
  const response = await api.get<Material[]>(`/materials/course/${courseId}`);
  return response.data;
};

export const uploadMaterial = async (
  title: string,
  description: string,
  courseId: number,
  file: File
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("courseId", String(courseId));
  formData.append("file", file);

  const response = await api.post<Material>("/materials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteMaterial = async (id: number) => {
  const response = await api.delete(`/materials/${id}`);
  return response.data;
};
