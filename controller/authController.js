import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //1st we strore req in variable that comes from user
  const { username, email, password } = req.body;
  // check all the  required details provided by user or not
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing Details",
    });
  }

  //handle user already exist
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message:
        existingUser.username === username
          ? "Username already exists"
          : "Email already exists",
    });
  }
  // 2nd hashed password
  const hashedPassword = await bcrypt.hash(password, 10);
  //3rd we store in model
  const newUser = new User({ username, email, password: hashedPassword });
  //Now store it in database
  try {
    await newUser.save();

    return res.status(201).json("User Created SucessFully");
  } catch (error) {
    // res.status(500).json(error.message);
    next(error);

    //In order to use our custom error
    // next(errorHandler(500, "Error from function"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); //hum is ko esay bi likh saktay thay   const validUser=User.findOne({email:email});  per after es6 agr key or values ka nam same ho to hum jst 1 time likh saktay hai
    if (!validUser) return next(errorHandler(404, "User Not found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));

    // Authenticate user using json web tokens
    //Step 1 Creating tokens
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //Now seperate the password from other user details because we did not want to sen back pasword along with details
    const { password: pass, ...rest } = validUser._doc;
    //Step 2 Save this token as cookie and send baack response
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Important Points related cookie
//     If you don’t set an expiry time, the cookie becomes a session cookie.
// ➤ Meaning:
// It lives only until the browser is closed.
// Once the user closes the browser (or tab), the cookie disappears.
// When the user opens the site again, they will be logged out.
// ✅ So:
// The cookie automatically expires when the browser session ends.

//                 >> controller function for continue with google

export const google = async (req, res, next) => {
  try {
    //First we will check that if the user already exist or not if the user already exist the only login the user else create a new user
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Authenticate user using json web tokens
      //Step 1 Creating tokens
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      //Now seperate the password from other user details because we did not want to sen back pasword along with details
      const { password: pass, ...rest } = user._doc;
      //Step 2 Save this token as cookie and send baack response
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        })
        .status(200)
        .json(rest);
    } else {
      //Jab humaray pass google se data ara hai to us me password nai hai per sign up kernay ke liay password chahiay is liay hum khud password banae gay
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      // toString(36) -->means 0 to 9 numbers and a to z characters
      // .slice(-8) means last 8 character
      //Now hashed the password
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      // we store in model
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      //save in db
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
