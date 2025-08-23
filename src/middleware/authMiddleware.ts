import { Request, Response, NextFunction } from "express";

export function fauxAuth(req: Request, res: Response, next: NextFunction) {
  // Token-based authentication
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Accept any token for demo purposes
  next();
}
