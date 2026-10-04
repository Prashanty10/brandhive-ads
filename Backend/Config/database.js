import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL environment variable is missing.");
    }

    const connection = await mongoose.connect(mongoUrl, {
      dbName: "BrandHive",
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    const handleShutdown = async (signal) => {
      try {
        await mongoose.connection.close();
        console.log(`MongoDB connection closed due to ${signal}`);
        process.exit(0);
      } catch (error) {
        console.error("Error while closing MongoDB connection:", error.message);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));

    console.log(`Database connected successfully to host: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;