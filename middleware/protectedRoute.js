import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default protectedRoute;
