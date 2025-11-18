// import mongoose from "mongoose";
// const connectDB = async () => {
//   await mongoose
//     .connect(process.env.MONGODB_URL)
//     .then(() => console.log("Mongodb Connected Successfully"))
//     .catch((err) => console.log("Error occur", err));
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000, // 30s timeout to avoid buffering errors
    });
    console.log("MongoDB Connected Successfully ✅");
  } catch (err) {
    console.error("MongoDB Connection Error ❌", err);
    throw err; // Important: prevent server from starting if DB fails
  }
};

export default connectDB;
