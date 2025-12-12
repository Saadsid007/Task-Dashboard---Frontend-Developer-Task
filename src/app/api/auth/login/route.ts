import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const data = loginSchema.parse(body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user._id.toString() });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
