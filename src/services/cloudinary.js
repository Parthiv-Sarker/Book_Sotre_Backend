import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
	
	try {
		
		if (!localFilePath) {
			throw new Error("Colud't find any local file.");
		}

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
			folder : "cover_images",
		});
		// console.log("File is Uploaded", response);
		fs.unlinkSync(localFilePath);
		
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath); // Remove the locally same temporary file as the upload operation is fail.
		console.log("cloudinary error",error);
		return null;
	}
};

export { uploadOnCloudinary };
