import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			index: true,
		},
		author: {
			type: String,
			required: true,
		},
		coverImage: {
			type: String,
			required: true,
		},
		addedBy: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Book = mongoose.model("Book", bookSchema);
