import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./database/db.js";
import cors from "cors";

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
import asssignmentRoutes from "./routes/assignment.js";
import submissionRoutes from "./routes/submission.js";
import messageRoutes from "./routes/message.js";
import resourceRoutes from "./routes/resources.js";


// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api", forumRoutes);
app.use("/api", asssignmentRoutes);
app.use("/api/", submissionRoutes);
app.use("/api", messageRoutes);
app.use("/api", resourceRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});