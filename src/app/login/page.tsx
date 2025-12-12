"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Login to access your dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-gray-700">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </label>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
