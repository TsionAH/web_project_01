import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/aau_social`);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
  }
};

export default connectDB;