"use client";

import { useEffect, useState } from "react";
import { getUsers, User } from "@/lib/userService";

export default function UsersPage() {
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

  if (loading) return <p className="p-6">Loading users...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">Role: {user.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
