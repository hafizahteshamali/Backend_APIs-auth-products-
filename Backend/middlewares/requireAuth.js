import jwt from "jsonwebtoken";
import authModel from "../Database/Models/AuthModel.js";
import dotenv from "dotenv";

dotenv.config();

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "No token provided, authorization denied" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    // find user
    const user = await authModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    req.user = user; // attach user to request object
    next(); // ✅ ye call karna mandatory hai

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default requireAuth;
