"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
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
    <nav className="border-b px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="hidden sm:flex gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <button
          onClick={handleLogout}
          className="hidden sm:block bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 text-sm w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

