import express from "express";
import { userAuth } from "../controllers/authController.js";
import { authService } from "../middlewares/jwtAuth.middleware.js";

const authRouter = express.Router();

authRouter.get("/admin-auth", authService);
authRouter.get("/user-auth", authService, userAuth);

export default authRouter;
