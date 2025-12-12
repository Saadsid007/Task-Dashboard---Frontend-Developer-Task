import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type JwtPayload = {
  userId: string;
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new Error("Invalid token");
  }
}
