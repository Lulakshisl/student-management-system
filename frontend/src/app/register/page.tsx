"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/authService";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register({ username, password, email, role });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;
      const backendDetails = err?.response?.data?.details;
      if (backendDetails && backendDetails.length > 0) {
        setError(backendDetails.join(", "));
      } else if (backendMessage) {
        setError(backendMessage);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f14] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a22] border border-[#2e2e38] rounded-2xl p-8 w-full max-w-sm shadow-xl"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-600/20 p-3 rounded-full mb-3">
            <GraduationCap size={28} className="text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 text-sm mt-1">Join the Student Management System</p>
        </div>

        {error && (
          <p className="bg-red-600/10 text-red-400 text-sm rounded-lg px-3 py-2 mb-4 text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-600/10 text-green-400 text-sm rounded-lg px-3 py-2 mb-4 text-center">
            {success}
          </p>
        )}

        <label className="block text-sm mb-1 text-gray-300">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label className="block text-sm mb-1 text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label className="block text-sm mb-1 text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label className="block text-sm mb-1 text-gray-300">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg px-3 py-2.5 mb-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="REGISTRAR">Registrar</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium hover:bg-indigo-500 disabled:opacity-50 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-5 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
