const jwt = require("jsonwebtoken");
const User = require("../models/user"); // ✅ make sure you have this
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

// ✅ Protect middleware for verifying JWT tokens and attaching user to req
exports.protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  console.log("🔐 AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("✅ DECODED TOKEN:", decoded);

    if (!decoded.id) {
      console.log("⚠️ Token does not contain `id`.");
      return res.status(401).json({ message: "Invalid token: missing id" });
    }

    // ✅ Attach full user document to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
