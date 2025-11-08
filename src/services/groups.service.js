const Groups = require("../models/Groups");

const addGroup = async (data) => {
  const group = new Groups(data);
  return await group.save();
};

const updateGroup = async (data) => {
  return await Groups.findByIdAndUpdate(data._id, data, {
    new: true,
    runValidators: true,
  });
};

const getGroupById = async (_id) => {
  return await Groups.findById(_id);
};

const getAllGroups = async (filter) => {
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

    const [items, total] = await Promise.all([
      Groups.find(searchQuery)
        .sort({ [sortBy]: sort })
        .skip(skip)
        .limit(itemsPerPage)
        .populate("institution", "_id name")
        .populate("createdBy", "_id name")
        .populate("professors", "_id name"),
      Groups.countDocuments(searchQuery),
    ]);

    response.itemsPerPage = itemsPerPage;
    response.page = page;
    response.sort = sort;
    response.size = items.length;
    response.totalItems = total;
    response.records = items;
    return response;
  } catch (e) {
    console.log("getAllEducationalInstitution Error: ", e);
    return response;
  }
};

module.exports = {
  addGroup,
  updateGroup,
  getGroupById,
  getAllGroups,
};
