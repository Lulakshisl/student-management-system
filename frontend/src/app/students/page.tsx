"use client";

import { useEffect, useState } from "react";
import { getStudents, Student } from "@/lib/studentService";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";
import { Mail, Calendar, MapPin, BookOpen } from "lucide-react";

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

  if (isChecking) return <p className="p-6 text-gray-400">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Students</h1>

        {loading && <p className="text-gray-400">Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-[#1a1a22] border border-[#2e2e38] rounded-xl p-5 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-white">{student.name}</h2>

              <div className="flex flex-col gap-1.5 mt-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500 shrink-0" />
                  {student.dateOfBirth}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-500 shrink-0" />
                  {student.address}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-500 shrink-0" />
                  {student.course?.name ?? "Not assigned"}
                </div>
              </div>
            </div>
          ))}

          {!loading && students.length === 0 && (
            <p className="text-gray-500 text-sm">No students found.</p>
          )}
        </div>
      </div>
    </>
  );
}
