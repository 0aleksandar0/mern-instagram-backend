import mongoose from "mongoose";

const instance = mongoose.Schema({
  // basic structure of each document
  caption: String,
  user: String,
  Image: String,
  comments: [],
});

export default mongoose.model("posts", instance);
