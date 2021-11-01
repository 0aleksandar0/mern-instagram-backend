import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";

// app config
const app = express(); // make the instance
const port = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.cors(cors()); // cors is a security middleware and it handles the headers

// DB config

// api routes
app.get("/", (req, res) => res.status(200).send("hello world")); //test the basic url

// listener
app.listen(port, () => console.log(`listening on localhost:${port}`));
