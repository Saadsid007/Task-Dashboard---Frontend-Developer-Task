import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const userId = await getCurrentUser();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}
