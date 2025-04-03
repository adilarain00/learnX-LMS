require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { ErrorMiddleWare } from "./utils/middleware/error";
import { rateLimit } from "express-rate-limit";

import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import courseRouter from "./routes/course.route";
import layoutRouter from "./routes/layout.route";
import orderRouter from "./routes/order.route";
import userRouter from "./routes/user.route";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import path from "path";

export const app = express();

// ✅ Apply CORS Globally
app.use(
  cors({
    origin: ["https://learn-x-jet.vercel.app", "http://localhost:3000", "https://learnx-lu5v.onrender.com"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);

// ✅ Handle Preflight Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://learn-x-jet.vercel.app");
  res.header("Access-Control-Allow-Origin", "https://learnx-lu5v.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204); // No Content
});

// ✅ Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ API Rate Limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // ⏳ 5 minutes
  max: 500, // 🚀 Increase request limit
  message: "Too many requests, please try again later.",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

// ✅ Serve Static Files (Production)
const buildPath = path.join(__dirname, "../client/next");
app.use(express.static(buildPath));

// ✅ API Routes with Correct Prefixes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

// ✅ Test Route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "CORS is working!",
  });
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is working!" });
});

// ✅ Handle Undefined Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// ✅ Global Error Handler Middleware
app.use(ErrorMiddleWare);
