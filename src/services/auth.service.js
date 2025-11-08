// src/services/auth.service.js
const User = require("../models/User");

// Servicio que busca un usuario por su nombre de usuario y contraseña
const findUser = async (username, password) => {
  return await User.findOne({ username, password });
};

const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const updateUser = async (data) => {
  return await User.findByIdAndUpdate(data._id, data, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  findUser,
  createUser,
  findUserByUsername,
  updateUser,
};
