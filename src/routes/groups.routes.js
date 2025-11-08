const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleWare");
const {
  addGroup,
  changeGroupStatus,
  getAllGroups,
} = require("../controllers/groups.controller");

const router = Router();

router.post("/add", authMiddleware("CREATE_GROUPS"), addGroup);
router.post("/getAll", authMiddleware("GET_GROUPS"), getAllGroups);
router.post(
  "/changeStatus",
  authMiddleware("UPDATE_GROUPS"),
  changeGroupStatus
);

module.exports = router;
