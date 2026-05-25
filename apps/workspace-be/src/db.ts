import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * This function retrieves the MongoDB connection URI from the environment variables
 * and attempts to create a connection. If the connection is successful, it returns
 * the Mongoose instance. In case of failure, it logs the error and rethrows it
 * for higher-level error handling.
 * */
export default async function connection(): Promise<mongoose.Mongoose> {
  // Retrieve MongoDB URI from environment variables
  let DB_URL = process.env.MONGODB_URI;

  try {
    // Attempt to connect to the MongoDB database
    const database = await mongoose.connect(DB_URL as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      //Connection pool
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected — attempting reconnect...");
    });

    return database;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
