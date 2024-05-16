import express from "express";
import {
	signUpUser,
	loginUser,
	getCurrentUser,
	updateUser,
	logoutUser,
} from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authService } from "../middlewares/jwtAuth.middleware.js";

const userRouter = express.Router();

userRouter.post("/sign-up", signUpUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", authService, logoutUser);
userRouter.post(
	"/update",
	authService,
	upload.single("profileImage"),
	updateUser
);
userRouter.get("/get-current-user", authService, getCurrentUser);

export default userRouter;
