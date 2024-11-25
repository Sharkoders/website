/**
 * Builds a new isAuthenticated middleware.
 * @returns The isAuthenticated middleware.
 */
export const isAuthenticated: RequestHandlerBuilder = () => {
  /**
   * Checks if a user is authenticated to the website.
   * @param req The request object.
   * @param _res The response object (not used).
   * @param next The next middleware.
   */
  return (req, _res, next) => {
    req.isAuthenticated = req.session._id != undefined;
    next();
  }
}

/**
 * Builds a new requireAuthentication middleware.
 * @returns The requireAuthentication middleware.
 */
export const requireAuthentication: RequestHandlerBuilder = () => {
  /**
   * Checks if a user is authenticated to the website.
   * Redirects to login page if not.
   * @param req The request object.
   * @param res The response object.
   * @param next The next middleware.
   */
  return (req, res, next) => {
    if (!req.isAuthenticated) {
      res.redirect("/login");
      return;
    }

    next();
  }
}