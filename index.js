import express from "express";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRoute from "./route/userRoutes.js";
import authRoute from "./route/authRoutes.js";
import cookieParser from "cookie-parser";
import listingRoute from "./route/listingRoute.js";

const app = express();

//connection with database
connectDB();

app.use(express.json());
//ye allow kerta hai ke req json me ae gi agr is ke bagair keray gay to undefined ae ga

app.use(cookieParser());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

app.use((error, req, res, next) => {
  // Ye error ka parameter authController me sign up function se error le ker ara hai
  const statusCode = error.statusCode || 500; // Is ko hum if else se bi ker saktay thay per acha tareeqa ye hai
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode, //Is line ko humm esay bi likh saktay thay  statusCode:statusCode  per after es6 agr key or values ka nam same ho to hum jst 1 time likh saktay hai
    message,
  });
});

app.listen(3000, () => console.log("Server is listening on port 3000!"));
