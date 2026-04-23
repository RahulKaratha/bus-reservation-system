import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Notification Service Running");
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});