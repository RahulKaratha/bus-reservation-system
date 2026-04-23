import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("User Service Running");
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});