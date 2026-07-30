import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "communityconnectng_super_secret";

const EXPIRES_IN = "7d";

export function generateToken(userId: string, role: string) {
  return jwt.sign(
    {
      userId,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: EXPIRES_IN,
    }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}