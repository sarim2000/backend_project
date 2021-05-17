const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Blog = require("./models/blog");
const Comment = require("./models/comment");

var methodOverride = require("method-override");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
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

app.get("/", (req, res) => {
	res.render("blog");
});

app.get("/blog", async (req, res) => {
	const blog = await Blog.find({});
	if (blog) {
		res.render("blog", { blog });
	}
});
app.get("/blog/new", (req, res) => {
	res.render("content");
});

app.get("/blog/:id/edit", async (req, res) => {
	const { id } = req.params;
	const blog = await Blog.findById(id);
	res.render("edit", { blog });
});
app.put("/blog/:id", async (req, res) => {
	const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
	});
	res.redirect(`/blog/${blog.id}`);
});

app.post("/blog", async (req, res) => {
	const blog = new Blog(req.body);
	await blog.save();
	res.redirect("blog");
});

app.post("/blog/:id/comments", async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	const comment = new Comment(req.body);
	blog.comments.push(comment);
	await comment.save();
	await blog.save();
	res.redirect(`/blog/${blog.id}`);
});

app.delete("/blog/:id", async (req, res) => {
	const { id } = req.params;
	await Blog.findByIdAndDelete(id);
	res.redirect("/blog");
});

app.get("/blog/:id", async (req, res) => {
	const { id } = req.params;
	const blog = await Blog.findById(id).populate("comments");
	res.render("show", { blog });
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
