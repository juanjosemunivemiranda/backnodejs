const Rooms = require("../models/Rooms");

const addRoom = async (data) => {
  const room = new Rooms(data);
  return await room.save();
};

const addManyRooms = async (data) => {
  const docs = data.map((r) => new Rooms(r));
  return await Rooms.insertMany(docs);
};

const updateRoom = async (data) => {
  return await Rooms.findByIdAndUpdate(data._id, data, {
    new: true,
    runValidators: true,
  });
};

const getRoomById = async (_id) => {
  return await Rooms.findById(_id);
};

const getAllRooms = async (decodedToken) => {
  const { ROLE, _id } = decodedToken.user;
  let filter = {};

  console.log("🚀 ~ getAllRooms ~ ROLE:", ROLE);
  if (ROLE === "PROFESSOR") filter = { professor: _id };
  if (ROLE === "STUDENT") filter = { student: _id };
  if (ROLE === "OBSERVER") filter = { observer: _id };
  console.log("🚀 ~ getAllRooms ~ filter:", filter);

  return await Rooms.find(filter)
    .populate("professor", "_id name")
    .populate("student", "_id name")
    .populate("observer", "_id name")
    .populate("group", "_id name");
};

const getRoomByRoomId = async (roomId) => {
  return await Rooms.findOne({ roomId });
};

module.exports = {
  addRoom,
  updateRoom,
  getRoomById,
  getAllRooms,
  getRoomByRoomId,
  addManyRooms,
};
