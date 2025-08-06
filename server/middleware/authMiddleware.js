import jwt from "jsonwebtoken";
import Users from "../models/usersModels.js";

const checkIfUserExists = async (req, res, next) => {
  try {
    const user = await Users.findOne({ emailAddress: req.body.emailAddress });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    next();
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Users.findOne({ userId: decoded?.userId }).select("-password")

      req.user = {
        ...user._doc,
        ...decoded,
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export {
  protect,
  checkIfUserExists
}