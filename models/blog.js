const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
	content: String,
	title: String,
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

module.exports = mongoose.model("Blog", BlogSchema);
