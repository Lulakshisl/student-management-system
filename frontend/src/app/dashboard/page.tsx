"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { isChecking } = useAuth();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  const sections = [
    { title: "Courses", description: "View and manage all courses", href: "/courses" },
    { title: "Students", description: "View and manage all students", href: "/students" },
    { title: "Users", description: "View and manage system users", href: "/users" },
  ];

  if (isChecking) return <p className="p-6">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Logged in as <span className="font-medium">{username}</span> ({role})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow block"
            >
              <h2 className="text-lg font-semibold mb-1">{section.title}</h2>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
