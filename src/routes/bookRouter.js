import express from "express";
import {
	addBook,
	currentUserBooks,
	getAllBooks,
} from "../controllers/bookController.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authService } from "../middlewares/jwtAuth.middleware.js";

const bookRouter = express.Router();

bookRouter.post("/add-book", authService, upload.single("coverImage"), addBook);
bookRouter.get("/current-user-books", authService, currentUserBooks);
bookRouter.get("/get-all-books", getAllBooks);

export default bookRouter;
