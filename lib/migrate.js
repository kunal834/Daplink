import { connectDB } from "./mongodb";
import User from "../models/user";

await connectDB();

await User.updateMany(
  {
    emailVerified: { $exists: false }
  },
  {
    $set: {
      emailVerified: true
    }
  }
);

console.log("Migration completed");
process.exit();