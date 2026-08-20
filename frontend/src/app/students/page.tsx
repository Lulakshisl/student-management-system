"use client";

import { useEffect, useState } from "react";
import { getStudents, Student } from "@/lib/studentService";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <p className="p-6">Loading students...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <div className="grid gap-4">
        {students.map((student) => (
          <div key={student.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
            <p className="text-sm text-gray-500 mt-1">DOB: {student.dateOfBirth}</p>
            <p className="text-sm text-gray-500">Address: {student.address}</p>
            <p className="text-sm text-gray-500">
              Course: {student.course?.name ?? "Not assigned"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
