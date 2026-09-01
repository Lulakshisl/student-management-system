"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { BookOpen, Users, ShieldCheck, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { isChecking } = useAuth();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setRole(localStorage.getItem("role") || "");
  }, []);

  const sections = [
    {
      title: "Courses",
      description: "View and manage all courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      title: "Students",
      description: "View and manage all students",
      href: "/students",
      icon: Users,
    },
    {
      title: "Users",
      description: "View and manage system users",
      href: "/users",
      icon: ShieldCheck,
    },
  ];

  if (isChecking) return <p className="p-6 text-gray-400">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gradient-to-r from-indigo-600/20 to-transparent border border-[#2e2e38] rounded-2xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, {username || "there"} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            You're signed in as{" "}
            <span className="text-indigo-400 font-medium">{role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-[#1a1a22] border border-[#2e2e38] rounded-xl p-6 shadow-md hover:shadow-lg hover:border-indigo-600/50 transition group"
              >
                <div className="bg-indigo-600/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-500" />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                  <ArrowRight
                    size={16}
                    className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition"
                  />
                </div>
                <p className="text-gray-400 text-sm mt-1">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
