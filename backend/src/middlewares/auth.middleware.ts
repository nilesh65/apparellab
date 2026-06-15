import { Request, Response, NextFunction } from "express";
import { getAuth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedException } from "../utils/app-error";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth();

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  })

  if (!session) {
    throw new UnauthorizedException("Unauthorized, Please sign in")
  }

  req.user = session.user;
  req.session = session;

  next();
}
