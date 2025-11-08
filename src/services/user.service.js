const User = require("../models/User");

const typeUsers = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  OBSERVER: "OBSERVER",
};

const getUserById = async (_id) => {
  return User.findById(_id);
};

const getUsersByAllId = async (students) => {
  return User.find({ _id: { $in: students } });
};

const getIdNameByTypeUser = async (decodedToken, typeUserParam) => {
  try {
    if (!Object.values(typeUsers).includes(typeUserParam)) {
      throw new Error(`Tipo de usuario inválido: ${typeUserParam}`);
    }
    const filter = { ROLE: typeUserParam };
    const result = await User.find(filter).select("_id name");
    return result;
  } catch (e) {
    return e.message;
  }
};

const getAllUsers = async (decodedToken, filter) => {
  var response = {
    page: 0,
    itemsPerPage: 10,
    size: 0,
    records: [],
    totalItems: 0,
    sort: "desc",
  };
  try {
    const page = parseInt(filter.paginator.page);
    const itemsPerPage = parseInt(filter.paginator.itemsPerPage);
    const skip = (page - 1) * itemsPerPage;

    const sortBy = filter.paginator.sortBy || "createdAt";
    const sort = filter.paginator.sort === "asc" ? 1 : -1;
    const search = filter.search;
    const searchQuery =
      search && search.trim() !== ""
        ? {
            $or: [{ name: { $regex: search, $options: "i" } }],
          }
        : {};

    if (decodedToken.user.ROLE == "ADMIN") {
      // searchQuery.institution = "";
    }
    const [items, total] = await Promise.all([
      User.find(searchQuery)
        .sort({ [sortBy]: sort })
        .populate("institution", "_id name")
        .skip(skip)
        .limit(itemsPerPage),
      User.countDocuments(searchQuery),
    ]);

    response.itemsPerPage = itemsPerPage;
    response.page = page;
    response.sort = sort;
    response.size = items.length;
    response.totalItems = total;
    response.records = items;
    return response;
  } catch (e) {
    console.log("getAllUsers Error: ", e);
    return response;
  }
};

const getUserBy = async (filter) => {
  return User.findOne(filter);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUsersByAllId,
  getIdNameByTypeUser,
  getUserBy,
};
