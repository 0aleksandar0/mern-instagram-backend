import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbModal from "./dbModal.js";

// app config
const app = express(); // make the instance
const port = process.env.PORT || 8080;

const pusher = new Pusher({
  appId: "1291552",
  key: "3af9192ba1a6ba62c4e5",
  secret: "c6b9a3d61119ef00bc04",
  cluster: "eu",
  useTLS: true,
});

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

  const changeStream = mongoose.connection.collection("post").watch();

  changeStream.on("change", (change) => {
    console.log("ChgStream Triggered on pusher...");
    console.log(change);
    console.log("End of Change");

    if (change.operationType === "insert") {
      console.log("Triggering Pusher ***Img UPLOAD***");

      const postDetails = change.fullDocument;
      pusher.trigger("post", "inserted", {
        user: postDetails.user,
        caption: postDetails.caption,
        image: postDetails.image,
      });
    } else {
      console.log("Unkown trigger from Pusher");
    }
  });
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
