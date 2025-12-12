import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { requireAuth } from "@/lib/auth";

const taskUpdateSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;

    const body = await req.json();
    const data = taskUpdateSchema.parse(body);

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
