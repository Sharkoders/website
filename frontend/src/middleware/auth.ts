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
    req.isAuthenticated = req.session.user != undefined;
    next();
  }
}