const { success, error } = require("../utils/response");
const educationalInstitutionService = require("../services/educationalInstitution.service");
const userService = require("../services/user.service");
const groupService = require("../services/groups.service");
const roomService = require("../services/rooms.service");
const { decodeToken } = require("../utils/decodeToken");

const addGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      institution,
      professors,
      students,
      configuration,
      date,
    } = req.body;

    const decodedToken = decodeToken(
      req.headers["authorization"]?.split(" ")[1]
    );
    const createdBy = decodedToken.user._id;

    const cleanInstitution = institution._id;
    const cleanProfessors = [];
    const cleanStudents = [];

    professors.forEach((p) => {
      cleanProfessors.push(p._id);
    });

    students.forEach((e) => {
      cleanStudents.push(e._id);
    });

    // Validar institution
    const institutionExists =
      await educationalInstitutionService.findEducationalInstitutionById(
        cleanInstitution
      );
    if (!institutionExists) {
      return error(res, "Institucion no encontrada", 404);
    }

    // Validar estudiantes
    const validStudents = await userService.getUsersByAllId(students);
    if (validStudents.length !== students.length) {
      return error(res, "Algunos estudiantes no existen", 405);
    }

    // Validar profesores
    const validprofessors = await userService.getUsersByAllId(cleanProfessors);
    if (validprofessors.length !== cleanProfessors.length) {
      return error(res, "Algunos maestros no existen", 406);
    }

    // preparar usuario observer por defecto
    const defaultObserver = await userService.getUserBy({
      institution: institution._id,
      ROLE: "OBSERVER",
    });

    // Validar observadores
    let observer = "";

    if (defaultObserver) {
      observer = defaultObserver._id;
    } else if (professors.length > 1) {
      observer = professors[1]._id;
    } else {
      return error(
        res,
        "La institucion no tiene un observador registrado, ingrese otro profesor a la lista",
        400
      );
    }

    // Crear el grupo con solo IDs
    const newGroup = await groupService.addGroup({
      name,
      description,
      institution,
      students,
      professors,
      rooms: [],
      createdBy,
      configuration,
    });

    // crear las salas por cada estudiante
    let rooms = [];

    students.forEach((student) => {
      console.log("🚀 ~ addGroup ~ student:", student);
      const roomId = `${newGroup._id.toString().slice(-6)}-${student._id
        .toString()
        .slice(-6)}-${Date.now().toString().slice(-6)}`;

      let room = {
        roomId,
        group: newGroup._id,
        student: student._id,
        professor: newGroup.professors[0]._id,
        observer,
        date: date,
        configuration: configuration,
        isActive: true,
      };
      rooms.push(room);
    });

    if (rooms.length > 0) {
      await roomService.addManyRooms(rooms);
    }

    success(res, newGroup, "Grupo creado exitosamente", 200);
  } catch (e) {
    console.log("🚀 ~ addGroup ~  e.message:", e);
    return error(res, e.message, 500);
  }
};

const changeGroupStatus = async (req, res) => {
  try {
    const { isActive, _id } = req.body;

    if (isActive === undefined || isActive === null) {
      return error(res, "Se requiere el estado", 402);
    }

    const group = await groupService.updateGroup({
      _id,
      isActive,
    });

    if (!group) {
      return error(res, "Grupo no encontrado", 404);
    }

    return success(res, group, "Se cambió el estado del grupo");
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const getAllGroups = async (req, res) => {
  try {
    const allGroups = await groupService.getAllGroups(req.body);

    return success(res, allGroups, "Consulta realizadas", 200);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

module.exports = {
  addGroup,
  changeGroupStatus,
  getAllGroups,
};
