import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

import userModel from "../Models/user.model.js";
import settingModel from "../Models/setting.model.js";
import tokenModel from "../Models/token.model.js";
import { sendMail } from "../utils/emailHandler.js";

/**
 * Logs a user in by validating credentials and issuing a JWT.
 * @param email - User email address
 * @param password - User password
 * @returns Authenticated user information and JWT token
 */
export const login = async (email: string, password: string) => {
  try {
    const user = await userModel.findOne({ email: email });
    const jwtSecret = process.env.JWT_SECRET;

    if (!user) {
      return { status: 401, message: "Your email is incorrect" };
    }

    if (!user.emailConfirm) {
      return { status: 401, message: "Email not verified" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: 401, message: "Your password is incorrect" };
    }

    // Generate JWT for authenticated session
    const token = jwt.sign({ email: user.email }, jwtSecret as string);

    // Persist session token for tracking
    await new tokenModel({
      userId: user._id,
      token: token,
      type: "auth",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).save();

    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      token: token,
      personalSetting: user.personalSetting,
    };
  } catch (error: any | Error) {
    return { status: 500, message: error.message };
  }
};

/**
 * Registers a new user and sends a verification email.
 * @param email - New user's email
 * @param password - User's chosen password
 * @param userName - User's display name
 */
export const signup = async (
  email: string,
  password: string,
  userName: string
) => {
  let user = await userModel.findOne({ email: email });
  const jwtSecret = process.env.JWT_SECRET;

  if (user) {
    return { status: 400, message: "User already exists" };
  }

  // Create default user setting
  const newSetting = await new settingModel({
    theme: "light",
    language: "en",
  }).save();

  // Create user document
  user = new userModel({
    email: email,
    name: userName,
    password: password,
    personalSetting: newSetting._id,
  });

  // Generate verification token
  const token = jwt.sign({ id: user._id }, jwtSecret as string, {
    expiresIn: "1h",
  });

  const tokenDoc = new tokenModel({
    userId: user._id,
    token: token,
    type: "verify",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  // Email verification link
  const verificationLink = `${process.env.SERVER_URL}/api/auth/verify-email?token=${token}&id=${user._id}`;

  const html = `
    <h1>Hello ${user.name}</h1>
    <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
    <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${verificationLink}</p>
    <p>This link will expire in 1 hour.</p>
  `;

  await Promise.all([
    user.save(),
    tokenDoc.save(),
    sendMail(user.email, "Verify Your Email Address", html),
  ]);

  return {
    user: user,
    token: token,
    message: "Signup successful, please verify your email",
  };
};

/**
 * Sends password reset link to user's email.
 * @param email - Registered user's email
 */
export const requestPasswordReset = async (email: string) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  // Remove old tokens
  await tokenModel.deleteOne({ userId: user._id, type: "auth" });

  // Generate new reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const link = `${process.env.CLIENT_URL}/set-new-password?token=${resetToken}&id=${user._id}`; //link tới frontend
  const resetLink = `${process.env.SERVER_URL}/api/auth/reset-password?token=${resetToken}&id=${user._id}`;
  const html = `
    <p>Hi ${user.name},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${link}">${link}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  await Promise.all([
    tokenModel.create({
      userId: user._id,
      token: hashedToken,
      type: "auth_change_password",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    }),
    sendMail(user.email, "Password Reset Request", html),
  ]);

  return {
    message: "Password reset link sent to your email",
    resetLink: resetLink,
    navigateLink: link,
  };
};

/**
 * Resets user password after validating reset token.
 * @param userId - ID of user requesting password change
 * @param token - Password reset token
 * @param password - New password
 */
export const resetPassword = async (
  userId: string,
  token: string,
  password: string
) => {
  const bcryptSalt = process.env.BCRYPT_SALT;

  const passwordResetToken = await tokenModel.findOne({
    userId: userId,
    type: "auth_change_password",
  });

  if (
    !passwordResetToken ||
    passwordResetToken.expiresAt.getTime() < new Date().getTime()
  ) {
    await passwordResetToken?.deleteOne();

    return {
      status: 404,
      message: "Expired password reset token",
      isSuccess: false,
    };
  }

  const hashedInput = crypto.createHash("sha256").update(token).digest("hex");
  if (hashedInput !== passwordResetToken.token) {
    return {
      status: 404,
      message: "Invalid password reset token",
      isSuccess: false,
    };
  }

  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await userModel.updateOne({ _id: userId }, { $set: { password: hash } });

  await passwordResetToken.deleteOne();

  return {
    message: "Password reset successful",
    isSuccess: true,
  };
};

/**
 * Signs out the user by deleting their active session token.
 * @param header - Authorization header from request
 */
export const signout = async (header: any) => {
  try {
    console.log(header);

    const token = header.split(" ")[1];
    await tokenModel.deleteOne({ token, type: "auth" });
    return true;
  } catch (err: any) {
    throw { status: 500, message: "Error signing out", error: err.message };
  }
};

/**
 * Confirms user's email address after signup.
 * @param token - Verification token sent to user's email
 * @param userId - ID of user to verify
 */
export const confirmEmail = async (token: string, userId: string) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return { status: 404, message: "JWT secret not configured" };
    }

    const decoded: any = jwt.verify(token, jwtSecret);
    if (decoded.id !== userId.trim()) {
      return { status: 404, message: "Invalid token or user ID" };
    }

    const tokenDoc = await tokenModel.findOne({
      userId,
      token,
      type: "verify",
    });

    if (!tokenDoc || tokenDoc.expiresAt.getTime() < new Date().getTime()) {
      return { status: 404, message: "Token expired or invalid" };
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return { status: 404, message: "User not found" };
    }

    user.emailConfirm = true;
    await Promise.all([user.save(), tokenDoc.deleteOne()]);

    return { message: "Email verified successfully", result: true };
  } catch (error: any) {
    return {
      status: 500,
      message: "Error verifying email",
      error: error.message,
    };
  }
};
