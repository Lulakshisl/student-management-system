"use client";

import { useEffect, useState } from "react";
import { getStudents, Student } from "@/lib/studentService";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";

export default function StudentsPage() {
  const { isChecking } = useAuth();
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

  if (isChecking) return <p className="p-6">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        {loading && <p>Loading students...</p>}
        {error && <p className="text-red-600">{error}</p>}
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
    </>
  );
}
