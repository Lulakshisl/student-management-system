"use client";

import { useEffect, useState } from "react";
import { getUsers, User } from "@/lib/userService";
import { useAuth } from "@/lib/useAuth";
import Navbar from "@/components/Navbar";
import { Mail } from "lucide-react";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-600/20 text-red-400",
  TEACHER: "bg-amber-600/20 text-amber-400",
  REGISTRAR: "bg-blue-600/20 text-blue-400",
  STUDENT: "bg-indigo-600/20 text-indigo-400",
};

export default function UsersPage() {
  const { isChecking } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isChecking) return <p className="p-6 text-gray-400">Checking authentication...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Users</h1>

        {loading && <p className="text-gray-400">Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-[#1a1a22] border border-[#2e2e38] rounded-xl p-5 shadow-md hover:shadow-lg transition flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-white">{user.username}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Mail size={14} className="text-indigo-500" />
                  {user.email}
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  roleColors[user.role] ?? "bg-gray-600/20 text-gray-300"
                }`}
              >
                {user.role}
              </span>
            </div>
          ))}

          {!loading && users.length === 0 && (
            <p className="text-gray-500 text-sm">No users found.</p>
          )}
        </div>
      </div>
    </>
  );
}
