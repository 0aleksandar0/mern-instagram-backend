import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbModal from "./dbModal.js";

// app config
const app = express(); // make the instance
const port = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(cors()); // cors is a security middleware and it handles the headers

// DB config
const connection_url =
  "mongodb+srv://admin:cNfoE4nKvPLcHrnu@cluster0.2krz9.mongodb.net/instagramDB?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  // create MongoDb instance
  /* useCreateIndex: true, */
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB Connected");
});
// api routes / api endpoints
app.get("/", (req, res) => res.status(200).send("hello world")); //test the basic url

app.post("/upload", (req, res) => {
  // this makes it possible to push an post
  const body = req.body;

  dbModal.create(body, (err, data) => {
    // makes it able to save a post
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/sync", (req, res) => {
  // for synchronized the data with the database and the frontend
  // makes it able to retrieve all the data from the database
  dbModal.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// listener
app.listen(port, () => console.log(`listening on localhost:${port}`));
