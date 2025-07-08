// src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js"; // ✅ Adjust path if needed
import uploadRoute from "./routes/uploadRoute.js";

// THEN import mongoose
import "./db/mongoose.js";

const app = express();

// Enable CORS
app.use(cors());

// Custom CORS headers (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

// Routes
app.use(userRoute);
app.use(uploadRoute);

export default app;
