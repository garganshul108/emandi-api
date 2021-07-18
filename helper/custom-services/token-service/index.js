const jwt = require("jsonwebtoken");
const config = require("config");
const JWT_SECRET_KEY = config.get("jwt-secret-key");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY);
};

const decodeToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

module.exports = Object.freeze({
  generateToken,
  decodeToken,
});
