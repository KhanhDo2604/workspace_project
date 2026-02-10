import { Router } from "express";
import {
  changeUserNameController,
  getUserController,
  getUserTasksController,
  updateUserAvatarController,
} from "../Controllers/user.controller.js";
import multer from "multer";

const userRouter = Router();
const upload = multer();

userRouter.get("/:id", getUserController);

userRouter.get("/get-task/:userId", getUserTasksController);

userRouter.put("/change_name/:userId", changeUserNameController);

userRouter.post(
  "/change-avatar",
  upload.single("file"),
  updateUserAvatarController
);

export default userRouter;
