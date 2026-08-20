"use client";

import Link from "next/link";

export default function DashboardPage() {
  const sections = [
    {
      title: "Courses",
      description: "View and manage all courses",
      href: "/courses",
    },
    {
      title: "Students",
      description: "View and manage all students",
      href: "/students",
    },
    {
      title: "Users",
      description: "View and manage system users",
      href: "/users",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
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
  );
}
