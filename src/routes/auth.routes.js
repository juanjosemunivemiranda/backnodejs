// src/routes/auth.routes.js

const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleWare");
const authController = require("../controllers/auth.controller");

const router = Router();

router.post("/login", authController.login);

router.post("/refresh", authController.refreshToken);

router.post(
  "/register",
  authMiddleware("CREATE_USER"),
  authController.register
);

module.exports = router;
