import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./Config/Database.js";
import router from "./Routes/userRoute.js";
import bannerrouter from "./Routes/bannerRoute.js";
import adspace_router from "./Routes/adspaceRoutes.js";
import bookingRouter from "./Routes/bookingRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/auth", router);
app.use("/banner", bannerrouter);
app.use("/adspaces", adspace_router);
app.use("/bookings", bookingRouter);

const port = process.env.PORT || 3000;

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route does not exist",
  });
});

app.use((err, req, res, next) => {
  console.log("server error", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "server error",
  });
});

const startserver = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startserver();
