import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (err: unknown) {
    res.status(400).json({
      message: err instanceof Error ? err.message : "Registration failed",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (err: unknown) {
    res.status(401).json({
      message: err instanceof Error ? err.message : "Login failed",
    });
  }
}