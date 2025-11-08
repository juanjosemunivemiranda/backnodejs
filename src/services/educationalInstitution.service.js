const EducationalInstitution = require("../models/EducationalInstitution");

const findEducationalInstitutionByConfig = async (name, type, email) => {
  return await EducationalInstitution.findOne({ name, type, email });
};

const addEducationalInstitution = async (data) => {
  const educationalInstitution = new EducationalInstitution(data);
  return await educationalInstitution.save();
};

const getAllEducationalInstitution = async (filter) => {
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
            $or: [
              { name: { $regex: search, $options: "i" } },
              { shortName: { $regex: search, $options: "i" } },
              { type: { $regex: search, $options: "i" } },
              { country: { $regex: search, $options: "i" } },
              { city: { $regex: search, $options: "i" } },
              { extraInfo: { $regex: search, $options: "i" } },
            ],
          }
        : {};

    const [items, total] = await Promise.all([
      EducationalInstitution.find(searchQuery)
        .sort({ [sortBy]: sort })
        .skip(skip)
        .limit(itemsPerPage),
      EducationalInstitution.countDocuments(searchQuery),
    ]);
    // return await EducationalInstitution.find(filter);
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

const updateEducationalInstitution = async (data) => {
  return await EducationalInstitution.findByIdAndUpdate(data._id, data, {
    new: true,
    runValidators: true,
  });
};

const findEducationalInstitutionById = async (_id) => {
  return await EducationalInstitution.findById(_id);
};

const getIdNameEducationalInstitution = async (decodedToken) => {
  try {
    const { ROLE } = decodedToken.user;
    let filter = {};
    if (!["ADMIN"].includes(ROLE)) {
      filter = {};
    }
    const result = await EducationalInstitution.find(filter).select("_id name");
    return result;
  } catch (error) {
    return [];
  }
};

module.exports = {
  findEducationalInstitutionByConfig,
  addEducationalInstitution,
  getAllEducationalInstitution,
  updateEducationalInstitution,
  findEducationalInstitutionById,
  getIdNameEducationalInstitution,
};
