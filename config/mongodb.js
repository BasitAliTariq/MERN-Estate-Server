// import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    });
    console.log("MongoDB Connected Successfully ✅");
  } catch (err) {
    console.error("MongoDB Connection Error ❌", err);
    throw err; // Important: throw error so server won't start
  }
};

export default connectDB;
