"use client";

import { useEffect, useState } from "react";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  Course,
} from "@/lib/courseService";
import {
  getMaterialsByCourse,
  uploadMaterial,
  deleteMaterial,
  Material,
} from "@/lib/materialsService";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";

const emptyForm: Course = { name: "", description: "", credits: 0 };

export default function CoursesPage() {
  const { isChecking } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [canManageMaterials, setCanManageMaterials] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Course>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);
  const [materialsByCourse, setMaterialsByCourse] = useState<Record<number, Material[]>>({});
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState("");

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "ADMIN");
    setCanManageMaterials(role === "ADMIN" || role === "TEACHER");
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (course: Course) => {
    setForm(course);
    setEditingId(course.id ?? null);
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (editingId) {
        await updateCourse(editingId, form);
      } else {
        await createCourse(form);
      }
      await fetchCourses();
      closeForm();
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      const backendDetails = err?.response?.data?.details;
      if (backendDetails && backendDetails.length > 0) {
        setFormError(backendDetails.join(", "));
      } else if (backendMessage) {
        setFormError(backendMessage);
      } else {
        setFormError("Failed to save course. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      await fetchCourses();
    } catch (err) {
      setError("Failed to delete course. Please try again.");
    }
  };

  const toggleMaterials = async (courseId: number) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    setExpandedCourseId(courseId);
    setMaterialsError("");
    setUploadTitle("");
    setUploadDescription("");
    setUploadFile(null);
    setUploadError("");

    if (!materialsByCourse[courseId]) {
      setMaterialsLoading(true);
      try {
        const data = await getMaterialsByCourse(courseId);
        setMaterialsByCourse((prev) => ({ ...prev, [courseId]: data }));
      } catch (err) {
        setMaterialsError("Failed to load materials.");
      } finally {
        setMaterialsLoading(false);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent, courseId: number) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("Please choose a file.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      await uploadMaterial(uploadTitle, uploadDescription, courseId, uploadFile);
      const data = await getMaterialsByCourse(courseId);
      setMaterialsByCourse((prev) => ({ ...prev, [courseId]: data }));
      setUploadTitle("");
      setUploadDescription("");
      setUploadFile(null);
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      const backendDetails = err?.response?.data?.details;
      if (backendDetails && backendDetails.length > 0) {
        setUploadError(backendDetails.join(", "));
      } else if (backendMessage) {
        setUploadError(backendMessage);
      } else {
        setUploadError("Failed to upload material.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (courseId: number, materialId: number) => {
    if (!confirm("Delete this material?")) return;
    try {
      await deleteMaterial(materialId);
      const data = await getMaterialsByCourse(courseId);
      setMaterialsByCourse((prev) => ({ ...prev, [courseId]: data }));
    } catch (err) {
      setMaterialsError("Failed to delete material.");
    }
  };

  if (isChecking) return <p className="p-6 text-gray-400">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Courses</h1>
          {isAdmin && (
            <button
              onClick={openCreateForm}
              className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-indigo-500 transition"
            >
              + Add Course
            </button>
          )}
        </div>

        {loading && <p className="text-gray-400">Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {showForm && (
          <form
            onSubmit={handleSave}
            className="bg-[#1a1a22] border border-[#2e2e38] rounded-xl p-6 mb-6 shadow-lg max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4 text-white">
              {editingId ? "Edit Course" : "New Course"}
            </h2>

            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}

            <label className="block text-sm mb-1 text-gray-300">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg px-3 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <label className="block text-sm mb-1 text-gray-300">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg px-3 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <label className="block text-sm mb-1 text-gray-300">Credits</label>
            <input
              type="number"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
              className="w-full rounded-lg px-3 py-2 mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="bg-[#2e2e38] text-gray-200 text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#3a3a46] transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-[#1a1a22] border border-[#2e2e38] rounded-xl p-5 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{course.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">{course.description}</p>
                </div>
                <span className="bg-indigo-600/20 text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                  {course.credits} Credits
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => openEditForm(course)}
                      className="text-sm bg-[#2e2e38] text-gray-200 rounded-lg px-3 py-1.5 hover:bg-[#3a3a46] transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => course.id && handleDelete(course.id)}
                      className="text-sm bg-red-600/90 text-white rounded-lg px-3 py-1.5 hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => course.id && toggleMaterials(course.id)}
                  className="text-sm bg-indigo-600 text-white rounded-lg px-3 py-1.5 hover:bg-indigo-500 transition"
                >
                  {expandedCourseId === course.id ? "Hide Materials" : "View Materials"}
                </button>
              </div>

              {expandedCourseId === course.id && course.id && (
                <div className="mt-4 border-t border-[#2e2e38] pt-4">
                  <h3 className="font-semibold mb-3 text-white text-sm">Lecture Materials</h3>

                  {materialsLoading && <p className="text-sm text-gray-400">Loading materials...</p>}
                  {materialsError && <p className="text-red-500 text-sm">{materialsError}</p>}

                  <div className="space-y-2 mb-4">
                    {(materialsByCourse[course.id] ?? []).length === 0 && !materialsLoading && (
                      <p className="text-sm text-gray-500">No materials uploaded yet.</p>
                    )}
                    {(materialsByCourse[course.id] ?? []).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between bg-[#0f0f14] border border-[#2e2e38] rounded-lg px-4 py-2.5"
                      >
                        <div>
                          <p className="font-medium text-white text-sm">{material.title}</p>
                          <p className="text-xs text-gray-400">{material.description}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            📄 {material.fileName} · uploaded by {material.uploadedBy}
                          </p>
                        </div>
                        {canManageMaterials && material.id && (
                          <button
                            onClick={() => handleDeleteMaterial(course.id!, material.id!)}
                            className="text-xs bg-red-600/90 text-white rounded-lg px-3 py-1.5 hover:bg-red-500 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {canManageMaterials && (
                    <form
                      onSubmit={(e) => handleUpload(e, course.id!)}
                      className="bg-[#0f0f14] border border-[#2e2e38] rounded-lg p-4 max-w-sm"
                    >
                      <h4 className="text-sm font-semibold mb-3 text-white">Upload New Material</h4>

                      {uploadError && <p className="text-red-500 text-xs mb-2">{uploadError}</p>}

                      <input
                        type="text"
                        placeholder="Title"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="w-full rounded-lg px-3 py-1.5 mb-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        className="w-full rounded-lg px-3 py-1.5 mb-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                        className="w-full text-xs text-gray-300 mb-3"
                        required
                      />
                      <button
                        type="submit"
                        disabled={uploading}
                        className="bg-indigo-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-indigo-500 disabled:opacity-50 transition"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
