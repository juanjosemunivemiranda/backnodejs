const { success, error } = require("../utils/response");
const educationalInstitutionService = require("../services/educationalInstitution.service");
const { decodeToken } = require("../utils/decodeToken");

const addEducationalInstitution = async (req, res) => {
  try {
    const {
      name,
      shortName,
      type,
      country,
      city,
      address,
      website,
      phone,
      email,
      accreditation,
      foundedYear,
      extraInfo,
    } = req.body;

    const existing =
      await educationalInstitutionService.findEducationalInstitutionByConfig(
        name,
        type,
        email
      );
    if (existing) {
      return error(res, "Institucion ya existe", 400);
    }

    const newAdditionalInstitution =
      await educationalInstitutionService.addEducationalInstitution({
        name,
        shortName,
        type,
        country,
        city,
        address,
        website,
        phone,
        email,
        accreditation,
        foundedYear,
        extraInfo,
      });

    return success(
      res,
      newAdditionalInstitution,
      "Instución creada correctamente",
      200
    );
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const getAllEducationalInstitution = async (req, res) => {
  try {
    const result =
      await educationalInstitutionService.getAllEducationalInstitution(
        req.body
      );

    if (!result) {
      return error(res, "No hay registros de Instituciones", 404);
    }

    return success(res, result, "Consulta exitosa", 200);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const updateEducationalInstitution = async (req, res) => {
  try {
    const { _id } = req.params;
    const body = req.body;

    const institution =
      await educationalInstitutionService.updateEducationalInstitution({
        _id,
        ...body,
      });

    if (!institution) {
      return error(res, "Institucion no encontrada", 404);
    }

    return success(res, institution, "Institucion actualizada correctamente");
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const changeStatusEducationalInstitution = async (req, res) => {
  try {
    const { isActive, _id } = req.body;

    if (isActive === undefined || isActive === null) {
      return error(res, "Se requiere el estado", 402);
    }

    const institution =
      await educationalInstitutionService.updateEducationalInstitution({
        _id,
        isActive,
      });

    if (!institution) {
      return error(res, "Institucion no encontrada", 404);
    }

    return success(res, institution, "Se cambió el estado a la institucion");
  } catch (e) {
    error(res, e.message, 500);
  }
};

const getIdNameEducationalInstitution = async (req, res) => {
  try {
    const decodedToken = decodeToken(
      req.headers["authorization"]?.split(" ")[1]
    );
    const result =
      await educationalInstitutionService.getIdNameEducationalInstitution(
        decodedToken
      );
    return success(res, result, "Consulta realizada correctamente", 200);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

module.exports = {
  addEducationalInstitution,
  getAllEducationalInstitution,
  updateEducationalInstitution,
  changeStatusEducationalInstitution,
  getIdNameEducationalInstitution,
};
