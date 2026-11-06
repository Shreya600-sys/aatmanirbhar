const User = require("../models/userModel");
const { verifyToken } = require("../utils/generateToken");

// Requires a valid "Authorization: Bearer <token>" header
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    const decoded = verifyToken(header.split(" ")[1]);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "This account no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "Invalid login. Please log in again.";
    res.status(401).json({ message });
  }
};

// Restricts a route to certain roles, e.g. authorize("provider")
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You are not allowed to do this." });
  }
  next();
};

module.exports = { protect, authorize };
