import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  //const token = req.cookies.access_token;

  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(errorHandler(403, "Token is not valid"));
    //if(error) return next(errorHandler(403,"forbidden"));
    req.user = user;
    next();
  });
};
