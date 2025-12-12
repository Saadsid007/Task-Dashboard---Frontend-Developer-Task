import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Task } from "@/models/Task";
import { requireAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = await requireAuth();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status")?.trim();

    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (status && ["todo", "in_progress", "done"].includes(status)) {
      filter.status = status;
    }

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).limit(200);

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

const taskCreateSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await requireAuth();

    const body = await req.json();
    const data = taskCreateSchema.parse(body);

    const task = await Task.create({
      ...data,
      userId,
    });

    return NextResponse.json({ task }, { status: 201 });
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
