"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { name: string; email: string };
type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter]);

  async function loadData() {
    try {
      setError(null);

      const userRes = await fetch("/api/me");
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const userData = await userRes.json();
      setUser(userData.user);

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (statusFilter) params.set("status", statusFilter);

      const tasksRes = await fetch(`/api/tasks?${params.toString()}`);
      if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
      const tasksData = await tasksRes.json();
      setTasks(tasksData.tasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("Failed to create task");

      setNewTask({ title: "", description: "" });
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleUpdateStatus(id: string, status: Task["status"]) {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDeleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {user && (
            <p className="mt-2 text-gray-600">
              {user.name} • {user.email}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border-2 border-gray-300 px-4 py-2 font-medium transition hover:border-gray-400"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Create Task & Filters */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Create Task */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Create New Task</h2>
          <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Task title"
              required
              minLength={2}
              maxLength={120}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description (optional)"
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Search & Filter */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Search & Filter</h2>
          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <p className="text-sm text-gray-600">
              Found {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="mt-4 space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No tasks found. Create your first task above!
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          task.status === "done"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.status === "in_progress"
                          ? "In Progress"
                          : task.status === "done"
                          ? "Done"
                          : "To Do"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          task._id,
                          e.target.value as Task["status"]
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
