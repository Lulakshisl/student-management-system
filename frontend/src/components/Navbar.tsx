"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link href="/dashboard" className="font-semibold">
          Dashboard
        </Link>
        <Link href="/courses">Courses</Link>
        <Link href="/students">Students</Link>
        <Link href="/users">Users</Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 text-sm"
      >
        Logout
      </button>
    </nav>
  );
}
