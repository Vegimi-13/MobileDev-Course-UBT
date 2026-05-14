import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid access token" });
  }
};
