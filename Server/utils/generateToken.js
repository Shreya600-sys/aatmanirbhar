const jwt = require("jsonwebtoken");

// JWT_ACCESS_SECRET is accepted too, so older .env files keep working.
const getSecret = () => process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;

const generateToken = (userId) =>
  jwt.sign({ userId }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRE || process.env.JWT_ACCESS_EXPIRE || "7d",
  });

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { generateToken, verifyToken, getSecret };
