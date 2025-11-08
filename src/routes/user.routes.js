const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleWare");
const {
  getIdNameByTypeUser,
  getAllUsers,
} = require("../controllers/user.controller");
const { register } = require("../controllers/auth.controller");

const router = Router();

router.post("/getIdName", authMiddleware("GET_USERS"), getIdNameByTypeUser);
router.post("/getAll", authMiddleware("GET_USERS"), getAllUsers);
router.post("/add", authMiddleware("CREATE_USER"), register);

module.exports = router;
