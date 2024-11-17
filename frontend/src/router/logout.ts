import { RequestHandler, Router } from "express";

const LogoutRouter = Router();

/**
 * Log out the user.
 * @param req The request object.
 * @param res The response object.
 */
const logout: RequestHandler = (req, res) => {
  req.session = null;
  res.redirect("/");
};

LogoutRouter.get("/", logout);

export default LogoutRouter;