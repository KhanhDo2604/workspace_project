import type { Request, Response } from "express";
import {
  signup,
  login,
  requestPasswordReset,
  resetPassword,
  signout,
  confirmEmail,
} from "../Services/auth.service.js";

/**
 * Handles user sign-out requests.
 * Extracts the JWT token from the request header and invalidates the session.
 */
export const signoutController = async (req: any, res: any) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(400).json({ message: "No token provided" });

    await signout(header);

    res.status(200).json({ message: "Signed out successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error signing out", error: err.message });
  }
};

/**
 * Handles user login.
 * Validates credentials and returns a JWT token upon successful authentication.
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await login(email, password);

    if (user.status === 401) {
      return res.status(401).json({ message: user.message });
    }

    res.status(200).json({ data: user, message: "Login successful" });
  } catch (error: Error | any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Handles new user registration.
 * Creates an account and triggers email confirmation.
 */
export const signupController = async (req: Request, res: Response) => {
  try {
    const { email, password, userName } = req.body;

    const signupService = await signup(email, password, userName);

    res.status(201).json(signupService);
  } catch (error: Error | any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

/**
 * Initiates password reset request.
 * Sends a reset link to the user's registered email.
 */
export const resetPasswordRequestController = async (
  req: Request,
  res: Response
) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

/**
 * Handles password reset confirmation.
 * Verifies token validity and updates user password.
 */
export const resetPasswordController = async (req: Request, res: Response) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );

  return res
    .status(resetPasswordService.status || 200)
    .json(resetPasswordService);
};

/**
 * Confirms user email after registration.
 * Redirects to the login page upon successful verification.
 */
export const confirmEmailController = async (req: Request, res: Response) => {
  const { token, id } = req.query;

  const confirmEmailService = await confirmEmail(token as string, id as string);
  if (confirmEmailService?.result) {
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  } else {
    return res.status(400).json(confirmEmailService);
  }
};
