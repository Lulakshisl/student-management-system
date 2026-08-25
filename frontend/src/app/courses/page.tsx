"use client";

import { useEffect, useState } from "react";
import { getCourses, Course } from "@/lib/courseService";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";

export default function CoursesPage() {
  const { isChecking } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (isChecking) return <p className="p-6">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>
        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{course.name}</h2>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-sm text-gray-500 mt-1">Credits: {course.credits}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
