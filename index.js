const mongoose = require("mongoose");
const Blog = require("./models/blog");
mongoose.connect("mongodb://localhost:27017/blog", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});
