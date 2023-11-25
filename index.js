import express, { urlencoded } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import DbConnection from "../mongoose.js";
import cookieParser from "cookie-parser";
import userRoutes from "./route/userRoutes.js";
import postRoutes from "./route/postRoutes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
// DbConnection();

const app = express();

const port = process.env.PORT || 6767;

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(cookieParser());
app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.Mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.error("Error connecting to Mongo", err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
