import jwt from "jsonwebtoken";

const authService = async (req, res, next) => {
	try {
		const token = req.cookies?.accessToken;
		if (!token) {
			return res
				.status(401)
				.json({ message: "Authentication token is missing" });
		}

		const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
		const userId = decodedToken.userId;

		req.userId = userId; // You can attach userId to req for later use in other middleware or routes
		next(); // Call next() to pass control to the next middleware
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export { authService };
