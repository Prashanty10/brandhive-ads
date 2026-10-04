import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./Config/Database.js";
import router from "./Routes/userRoute.js";
import bannerrouter from "./Routes/bannerRoute.js";
import adspace_router from "./Routes/adspaceRoutes.js";
import bookingRouter from "./Routes/bookingRoute.js";

dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Rate limit applied specifically to auth routes
app.use("/auth", authLimiter, router);
app.use("/banner", bannerrouter);
app.use("/adspaces", adspace_router);
app.use("/bookings", bookingRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "UP", timestamp: new Date().toISOString() });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message);

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const port = process.env.PORT || 3000;

const startserver = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`BrandHive Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startserver();
