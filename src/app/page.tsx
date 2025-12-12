import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Task Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">
          A modern task management application with secure authentication.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 font-medium transition hover:border-gray-400"
          >
            Register
          </Link>
        </div>

        <div className="mt-12 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Features</h2>
          <ul className="mt-3 space-y-2 text-left text-sm text-gray-600">
            <li>✅ JWT-based authentication with httpOnly cookies</li>
            <li>✅ CRUD operations on tasks</li>
            <li>✅ Search and filter functionality</li>
            <li>✅ Responsive design with Tailwind CSS</li>
            <li>✅ MongoDB database integration</li>
            <li>✅ TypeScript for type safety</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
