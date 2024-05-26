import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/connectDB.js";
import userRouter from "./src/routes/userRouter.js";
import bookRouter from "./src/routes/bookRouter.js";
import authRouter from "./src/routes/authRouter.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 8000;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.get("/", (req, res) => {
	res.json({
		message:"Express Server."
	});
});

app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/auth", authRouter);

app.listen(port, () => {
	console.log(`Server is running at port:- ${port}`);
});
