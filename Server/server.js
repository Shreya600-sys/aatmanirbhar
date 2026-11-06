require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const seedCategories = require("./utils/seedCategories");

// Stop early with a clear message if something important is missing
const missing = [];
if (!process.env.MONGO_URI) missing.push("MONGO_URI");
if (!process.env.JWT_SECRET && !process.env.JWT_ACCESS_SECRET) missing.push("JWT_SECRET");
if (missing.length > 0) {
  console.error(`Missing environment variable(s): ${missing.join(", ")}`);
  console.error("Copy Server/.env.example to Server/.env (or set them on your host) and fill them in.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Optional: limit which websites may call this API (comma separated, no trailing slash)
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0
      ? [...allowedOrigins, "http://localhost:5173", "http://localhost:5174"]
      : true,
  })
);
app.use(express.json());

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/categories", require("./routes/categoryRoutes"));
app.use("/api/v1/services", require("./routes/serviceRoutes"));
app.use("/api/v1/bookings", require("./routes/bookingRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));
app.use("/", require("./routes/testRoutes")); // health check

// Unknown URL
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Any other error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

connectDB()
  .then(seedCategories)
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Could not start the server:", error.message);
    console.error("Check MONGO_URI, and that your MongoDB Atlas Network Access allows your server (0.0.0.0/0).");
    process.exit(1);
  });
