// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
// console.log(MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error(" Missing MONGODB_URI in .env file");
}

let isConnected = false; // track state

export async function connectDB() {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;

        console.log(" MongoDB Connected Successfully");
    } catch (error) {
        console.log(" MongoDB Connection Failed", error);
    }
}
