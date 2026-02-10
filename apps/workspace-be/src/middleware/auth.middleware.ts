import jwt from "jsonwebtoken";
import tokenModel from "../Models/token.model.js";
/**
 * This middleware verifies the JWT token attached to the request header.
 * It ensures that only authenticated users can access protected routes.
 *
 * Workflow:
 * 1. Extract the "Authorization" header from the request.
 * 2. Validate the presence of a token and decode it using JWT.
 * 3. Check whether the token still exists in the database (not revoked or expired).
 * 4. Attach the decoded user information to `req.user` and allow request to continue.
 *
 * If the token is missing, invalid, or expired, the middleware responds with a 401 error.
 */
export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    // Extract token from "Authorization" header (format: "Bearer <token>")
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    // Verify JWT token using secret key
    const jwtSecret = process.env.JWT_SECRET as string;
    const decoded: any = jwt.verify(token, jwtSecret);

    // Ensure token still exists in DB (not revoked or expired)
    const tokenExists = await tokenModel.findOne({ token: token });
    if (!tokenExists) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    // Attach decoded user info to request for downstream usage
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
