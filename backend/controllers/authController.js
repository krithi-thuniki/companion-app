const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const LoginHistory = require("../models/LoginHistory");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const TOKEN_EXPIRES = "7d";

// Helper to log login attempts
async function logLogin({ userId = null, usernameAttempt = null, success = false, reason = null, req = null }) {
  try {
    await LoginHistory.create({
      userId,
      usernameAttempt,
      success,
      reason,
      ipAddress: req?.ip || null,
      userAgent: req?.headers?.["user-agent"] || null,
    });
  } catch (err) {
    console.error("LoginHistory logging failed:", err);
  }
}

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "username, email and password are required" });

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashed, name });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

    return res.json({ ok: true, token, user: user.toJSON() });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) return res.status(400).json({ error: "User with same username/email already exists" });
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      await logLogin({ usernameAttempt: username || null, success: false, reason: "missing_fields", req });
      return res.status(400).json({ error: "username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      await logLogin({ usernameAttempt: username, success: false, reason: "user_not_found", req });
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await logLogin({ userId: user._id, usernameAttempt: username, success: false, reason: "invalid_password", req });
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    await logLogin({ userId: user._id, usernameAttempt: username, success: true, reason: "success", req });

    return res.json({ ok: true, token, user: user.toJSON() });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ error: "Token missing" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const lastLogin = await LoginHistory.findOne({
      userId: decoded.id,
      logoutTime: { $exists: false },
    }).sort({ loginTime: -1 });

    if (lastLogin) {
      lastLogin.logoutTime = new Date();
      await lastLogin.save();
    }

    return res.json({ ok: true, message: "Logout recorded successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
};
