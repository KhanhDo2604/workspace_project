import { Router } from "express";
import { signoutController, syncUser } from "../Controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

// Get
authRouter.get("/", (req, res) => {
  res.json({ message: "API v1 is working!" });
});

// authRouter.get("/verify-email", confirmEmailController);

//Post
authRouter.post("/sync-user", authMiddleware, syncUser);

// authRouter.post("/login", loginController);

// authRouter.post("/signup", signupController);

// authRouter.post("/forgot-password", resetPasswordRequestController);

// authRouter.post("/reset-password", resetPasswordController);

authRouter.post("/sign-out", authMiddleware, signoutController);

export default authRouter;
