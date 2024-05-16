import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGODB_URI, {
			dbName: process.env.DB_NAME,
		});
		console.log("Database connected successfully.");
		// console.log(connection);
	} catch (error) {
		console.log("Error to connect with Database!!", error);
		process.exit(1);
	}
};

export default connectDB;
