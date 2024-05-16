import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

const addBook = async (req, res) => {
	const { title, author } = req.body;

	const userId = req.userId;

	try {
		const book = await Book.findOne({ title });

		if (book) {
			return res.status(400).json({ message: "Book already exists" });
		}

		const localFilePath = req.file?.path;

		if (!localFilePath) {
			throw new Error("CoverImage file is required.");
		}

		const uploadedFile = await uploadOnCloudinary(localFilePath);

		const newBook = await Book.create({
			title,
			author,
			coverImage: uploadedFile.secure_url,
			addedBy: userId,
		});

		const updateUserBookHistory = await User.findByIdAndUpdate(
			userId,
			{ $push: { bookHistory: newBook._id } }, // Append the new book ID to bookHistory array
			{ new: true }
		);

		return res.json({
			message: "Book added successfully",
			newBook,
			updateUserBookHistory,
		});
	} catch (error) {
		console.log("Failed to add book:", error);
		return res.status(500).json({ message: "Failed to add book" });
	}
};

const currentUserBooks = async (req, res) => {
	const userId = req.userId;
	try {
		const currentUser = await User.findById({ _id: userId });

		const currentUserBooks = await Book.find({
			_id: currentUser.bookHistory,
		});

		return res.json({
			message: "Books fetched successfully",
			currentUserBooks,
		});
	} catch (error) {
		console.log("Failed to fetch books", error);
		return res.status(500).json({ message: "Failed to fetch books" });
	}
};

const getAllBooks = async (req, res) => {
	try {
		const allBooks = await Book.find();
		if (!addBook) {
			throw new Error("No books are available.")
		}
		
		return res.json({
			message: "Books fetched successfully",
			allBooks,
		});
	} catch (error) {
		console.log("Failed to fetch books", error);
		return res.status(500).json({ message: "Failed to fetch books" });
	}
};

export { addBook, currentUserBooks, getAllBooks };
