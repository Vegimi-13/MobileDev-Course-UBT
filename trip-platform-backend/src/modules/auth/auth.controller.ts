import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation";
import * as service from "./auth.service";
import { LoginBody, RegisterBody, RefreshBody, LogoutBody } from "./auth.types";

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await service.register(data);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const tokens = await service.login(data.email, data.password);
    res.json(tokens);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const refresh = async (
  req: Request<{}, {}, RefreshBody>,
  res: Response,
) => {
  try {
    const data = refreshSchema.parse(req.body);

    const result = await service.refresh(data.refreshToken);

    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = async (
  req: Request<{}, {}, LogoutBody>,
  res: Response,
) => {
  try {
    const data = refreshSchema.parse(req.body);
    await service.logout(data.refreshToken);

    res.json({ message: "Logged out" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
