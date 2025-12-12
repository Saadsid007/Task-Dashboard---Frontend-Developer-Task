import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const userId = await requireAuth();

    const user = await User.findById(userId).select(
      "name email createdAt updatedAt"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

const updateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
});

export async function PUT(req: Request) {
  try {
    await connectDB();
    const userId = await requireAuth();

    const body = await req.json();
    const data = updateSchema.parse(body);

    const user = await User.findByIdAndUpdate(userId, { $set: data }, { new: true }).select(
      "name email createdAt updatedAt"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
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
