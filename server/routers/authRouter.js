//authRouter.js

require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const authBLL = require("../BLL/authBLL");
const router = express.Router();

// Entry Point: 'http://localhost:8000/auth

router.route("/login").post(async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //validate credentials
    const credentials = await authBLL.getUserByUsername(username);
    if (credentials.username && credentials.password === password) {
      // Generate and return access token
      const userId = "someId";
      const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
      const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET_TOKEN, {
        expiresIn: "10h",
      });
      return res
        .status(200)
        .json({ accessToken: accessToken, name: credentials.name });
    } else {
      res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
