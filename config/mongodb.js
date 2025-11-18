import mongoose from "mongoose";
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Mongodb Connected Successfully"))
    .catch((err) => console.log("Error occur", err));
};

export default connectDB;
