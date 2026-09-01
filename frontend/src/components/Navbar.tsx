"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Courses", href: "/courses" },
    { label: "Students", href: "/students" },
    { label: "Users", href: "/users" },
  ];

  return (
    <nav className="bg-[#1a1a22] border-b border-[#2e2e38] px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-semibold">
          <GraduationCap size={22} className="text-indigo-500" />
          <span className="hidden sm:inline">SMS</span>
        </div>

        <div className="hidden sm:flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-[#2e2e38] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          className="sm:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <button
          onClick={handleLogout}
          className="hidden sm:block bg-red-600/90 text-white px-4 py-1.5 rounded-lg hover:bg-red-500 text-sm font-medium transition"
        >
          Logout
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden mt-3 flex flex-col gap-1 pb-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-[#2e2e38] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="bg-red-600/90 text-white px-4 py-2 rounded-lg hover:bg-red-500 text-sm font-medium mt-1 w-fit transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
