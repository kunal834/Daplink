// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env file");
}

// 1. Initialize a cached variable in the global scope
// This ensures the connection survives hot reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {

   
  // 2. If a connection already exists, return it immediately
  if (cached.conn) {
    
    console.log("Using existing database connection");
    return cached.conn;
  }

  // 3. If no connection exists, start a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB Connected Successfully");
      return mongoose;
    });
  }

  // 4. Await the promise and cache the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.log("MongoDB Connection Failed", e);
    throw e;
  }

  return cached.conn;
}