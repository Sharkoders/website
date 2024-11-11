import session from "cookie-session";
import { Request, Response } from "express";
import Keygrip from "keygrip";

const sessionMiddleware: () => ((req: Request, res: Response, next: (err?: unknown) => void) => void) = () => session({
  name: "sharkoder-session",
  keys: new Keygrip(process.env.SESSION_KEYS.split("."), "SHA384", "base64"),
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60
});

export default sessionMiddleware;