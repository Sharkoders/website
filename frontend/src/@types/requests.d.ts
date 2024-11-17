import { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      session: {
        isChanged: boolean;
        isNew: boolean;
      } & Record<string, any>;
      isAuthenticated: boolean;
    }
  }
  type RequestHandlerBuilder = (...params: unknown[]) => RequestHandler;
}
