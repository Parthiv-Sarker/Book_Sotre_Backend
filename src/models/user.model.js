import mongoose, { Schema } from "mongoose";

const DEFAULT_PROFILE_IMAGE_URL =
	"https://res.cloudinary.com/diokp5zbk/image/upload/v1715830020/cover_images/owahcdhckyex9bo3cbnr.png";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		bookHistory: [
			{
				type: Schema.Types.ObjectId,
				ref: "Book",
			},
		],
		profileImage: {
			type: String,
			default: DEFAULT_PROFILE_IMAGE_URL,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);
