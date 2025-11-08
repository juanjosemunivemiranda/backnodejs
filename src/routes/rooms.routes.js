const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleWare");
const {
  addRoom,
  updateRoom,
  getRoomById,
  getAllRooms,
  getRoomByRoomId,
} = require("../controllers/rooms.controller");

const router = Router();

router.post("/add", authMiddleware("CREATE_ROOMS"), addRoom);
router.post("/update", authMiddleware("UPDATE_ROOMS"), updateRoom);
router.post("/getById", authMiddleware("GET_ROOMS"), getRoomById);
router.post("/getAll", authMiddleware("GET_ROOMS"), getAllRooms);
router.post("/getRoomByRoomId", authMiddleware("GET_ROOMS"), getRoomByRoomId);

module.exports = router;
