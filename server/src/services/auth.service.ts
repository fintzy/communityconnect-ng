import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashed,
    },
  });

  const token = generateToken(user.id, user.role);

  return {
    token,
    user,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user,
  };
}