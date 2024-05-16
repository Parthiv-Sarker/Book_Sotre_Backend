// import { User } from "../models/user.model";

const userAuth = async (req, res) => {
	const userId = req.userId;
	try {
		return res.json({
			message: "Done",
			userId,
		});
	} catch (error) {
		console.error("User authentication failed.", error);
		return res.status(500).json({ message: "User authentication failed." });
	}
};

export { userAuth };
