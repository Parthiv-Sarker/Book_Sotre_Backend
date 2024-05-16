import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

const signUpUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (!username || !email || !password) {
			throw new Error("Please provide all required fields.");
		}

		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		return res.status(201).json({
			message: "User created successfully.",
			user: {
				id: newUser._id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error("Failed to create user:", error);
		return res.status(500).json({ message: "Failed to create user." });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw new Error("Please provide all required fields.");
		}
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				message:
					"Invalid credentials. Please check your email and password.",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({
				message:
					"Invalid credentials. Please check your email and password.",
			});
		}

		// Find the user by the user Id and exclude the password field
		const loggedInUser = await User.findById(user._id).select("-password");

		// Create JWT token
		const accessToken = jwt.sign(
			{
				userId: loggedInUser._id,
				userName: loggedInUser.username,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "30d", // Token expires in 1 day
			}
		);

		const options = {
			httpOnly: true,
			secure: true,
		};

		const response = res.cookie("accessToken", accessToken, options).json({
			message: "User logged in successfully.",
			user: {
				id: loggedInUser._id,
				username: loggedInUser.username,
				email: loggedInUser.email,
			},
			token: {
				accessToken,
			},
		});

		return response;
	} catch (error) {
		console.error("Failed to login user:", error);
		return res.status(500).json({ message: "Failed to login user." });
	}
};

const getCurrentUser = async (req, res) => {
	const userId = req.userId;
	try {
		if (!userId) {
			throw new Error("User Id is not available.");
		}
		const user = await User.findOne({ _id: userId }).select("-password");

		if (!user) {
			return res.status(400).json({
				message: "No user found.",
			});
		}

		const response = res.json({
			message: "User Found.",
			user,
		});

		return response;
	} catch (error) {
		console.error("Failed to Find user:", error);
		return res.status(500).json({ message: "Failed to Find user." });
	}
};

const updateUser = async (req, res) => {
	const userId = req.userId;
	try {
		if (!userId) {
			throw new Error("User Id is not available.");
		}
		const user = await User.findOne({ _id: userId }).select("-password");

		if (!user) {
			return res.status(400).json({
				message: "No user found.",
			});
		}

		const localFilePath = req.file?.path;

		if (!localFilePath) {
			throw new Error("ProfileImage file is required.");
		}

		const uploadedFile = await uploadOnCloudinary(localFilePath);

		const updateUser = await User.findByIdAndUpdate(
			user._id,
			{ profileImage: uploadedFile.secure_url }, // Append the new book ID to bookHistory array
			{ new: true }
		).select("-password");

		const response = res.json({
			message: "User updated successfully.",
			updateUser,
		});

		return response;
	} catch (error) {
		console.error("Failed to update user:", error);
		return res.status(500).json({ message: "Failed to update user." });
	}
};

const logoutUser = async (req, res) => {
	try {
		const options = {
			httpOnly: true,
			secure: true,
		};

		const response = res.clearCookie("accessToken", options).json({
			message: "User logout successfully.",
		});

		return response;
	} catch (error) {
		console.error("Failed to logout user:", error);
		return res.status(500).json({ message: "Failed to logout user." });
	}
};

export { signUpUser, loginUser, getCurrentUser, updateUser, logoutUser };
