import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user/", UserRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from GFG",
  });
});

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

const startServer = async () => {
  try {
    // Validate environment variables
    if (!process.env.PORT || !process.env.MONGODB_URI) {
      throw new Error("Missing required environment variables");
    }

    await connectDB();
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("Shutting down server...");
      server.close(() => {
        console.log("Server stopped");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
