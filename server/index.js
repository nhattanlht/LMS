import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./database/db.js";
// import Razorpay from "razorpay";
import cors from "cors";

// export const instance = new Razorpay({
//   key_id: process.env.Razorpay_Key,
//   key_secret: process.env.Razorpay_Secret,
// });

// using middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

// app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import forumRoutes from "./routes/forum.js";
import gradeRoutes from "./routes/grade.js";
import asssignmentRoutes from "./routes/assignment.js";
import messageRoutes from "./routes/message.js";
import resourceRoutes from "./routes/resources.js";


// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api", forumRoutes);
app.use("/api", gradeRoutes);
app.use("/api", asssignmentRoutes);
app.use("/api", messageRoutes);
app.use("/api", resourceRoutes);




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});

// import { uploadFiles } from "./middlewares/multer.js";
// import { handleUpload } from "./config/cloudinary.js";
// app.post("/upload", uploadFiles, async (req, res) => {
//   try {
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//     const cldRes = await handleUpload(dataURI);
//     res.json(cldRes);
//   } catch (error) {
//     console.log(error);
//     res.send({
//       message: error.message,
//     });
//   }
// });