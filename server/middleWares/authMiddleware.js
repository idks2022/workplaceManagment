//authMiddleware.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.status(401).json("Unauthorized: token to provided.");
    }

    const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;

    jwt.verify(token, ACCESS_SECRET_TOKEN, (error, data) => {
      if (error) return res.sendStatus(403);
      res.data = data;
      next();
    });
  } catch (error) {
    res.status(401);
  }
};
