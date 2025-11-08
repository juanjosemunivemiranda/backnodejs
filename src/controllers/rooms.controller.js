const { success, error } = require("../utils/response");
const roomService = require("../services/rooms.service");
const groupService = require("../services/groups.service");
const userService = require("../services/user.service");
const { decodeToken } = require("../utils/decodeToken");

const addRoom = async (req, res) => {
  try {
    const { group, student, date, observer } = req.body;
    // Verificar existencia del grupo
    const validGroup = await groupService.getGroupById(group);
    if (!validGroup) {
      return error(res, "No se encontró el grupo", 404);
    }
    // Validar estudiantes
    const validStudent = await userService.getUserById(student);
    if (!validStudent) {
      return error(res, "No se encontró el estudiante", 405);
    }
    // Validar Observador
    const validObserver = await userService.getUserById(observer);
    if (!validObserver) {
      return error(res, "No se encontró el usuario observador", 406);
    }

    if (!validGroup.isActive) {
      return error(res, "El grupo está desactivado", 407);
    }

    if (validStudent.ROLE !== "STUDENT") {
      return error(
        res,
        "El usuario estudiante relacionado no tiene rol de estudiante",
        408
      );
    }

    if (validObserver.ROLE !== "OBSERVER") {
      return error(
        res,
        "El usuario observador relacionado no tiene rol de observador",
        409
      );
    }

    const roomId = `${validGroup._id
      .toString()
      .slice(-6)}-${validStudent.id.slice(-6)}-${Date.now()
      .toString()
      .slice(-6)}`;

    const newRoom = await roomService.addRoom({
      roomId,
      group: validGroup._id,
      student: validStudent.id,
      professor: validGroup.professors[0],
      observer: observer,
      date,
      isActive: false,
      configuration: validGroup.configuration, // Setea la configuracion del grupo por defecto
    });

    if (!newRoom) return error(res, "No se pudo crear la sala", 410);

    if (newRoom._id) {
      // Actualizar grupo para relacionar la sala
      const updatedGroup = await groupService.updateGroup({
        _id: validGroup._id,
        rooms: [...validGroup.rooms, newRoom._id],
      });

      if (!updatedGroup)
        return error(
          res,
          "Sala creada con un error, no se pudo relacionar en el grupo, contacta con soporte",
          200
        );
    }

    return success(res, newRoom, "Sala creado exitosamente", 200);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const updateRoom = async (req, res) => {
  try {
    const { _id, date, observer, professor, isActive, configuration } =
      req.body;

    // Validar Sala
    const validRoom = await roomService.getRoomById(_id);
    if (!validRoom) {
      return error(res, "No se encontró la sala", 406);
    }

    // Validar Observador
    const validObserver = await userService.getUserById(observer);
    if (!validObserver) {
      return error(res, "No se encontró el usuario observador", 406);
    }

    // Validar Profesor
    const validProfessor = await userService.getUserById(professor);
    if (!validProfessor) {
      return error(res, "No se encontró el usuario profesor", 406);
    }

    if (validObserver.ROLE !== "OBSERVER") {
      return error(
        res,
        "El usuario observador relacionado no tiene rol de observador",
        402
      );
    }

    if (validProfessor.ROLE !== "TEACHER") {
      return error(
        res,
        "El usuario profesor relacionado no tiene rol de profesor",
        402
      );
    }

    const updatedRoom = await roomService.updateRoom({
      _id,
      date,
      observer,
      professor,
      isActive,
      configuration,
    });

    return success(res, updatedRoom, "Sala actualizada correctamente", 200);
  } catch (e) {
    error(res, e.message, 500);
  }
};

const getRoomById = async (req, res) => {
  try {
    const { _id } = req.body;
    if (_id === null || _id === undefined) {
      return error(res, "El id de la sala es obligatoria", 401);
    }
    const room = await roomService.getRoomById(_id);

    if (!room) return error(res, "La sala no existe", 404);

    return success(res, room, "Consulta realizada", 200);
  } catch (e) {
    error(res, e.message, 500);
  }
};

const getRoomByRoomId = async (req, res) => {
  try {
    const { roomId } = req.body;

    const decodedToken = decodeToken(
      req.headers["authorization"]?.split(" ")[1]
    );

    if (roomId === null || roomId === undefined) {
      return error(res, "El id de la sala es obligatoria", 401);
    }

    const room = await roomService.getRoomByRoomId(roomId);
    if (!room) return error(res, "La sala no existe", 404);

    if (decodedToken.user.ROLE === "TEACHER") {
      if (!room.professor.equals(decodedToken.user._id)) {
        return error(
          res,
          "Éste usuario no tiene permisos para acceder a la sala como Profesor",
          400
        );
      }
    }

    if (decodedToken.user.ROLE === "STUDENT") {
      if (!room.student.equals(decodedToken.user._id)) {
        return error(
          res,
          "Éste usuario no tiene permisos para acceder a la sala como Estudiante",
          400
        );
      }
    }

    if (decodedToken.user.ROLE === "OBSERVER") {
      if (!room.observer.equals(decodedToken.user._id)) {
        return error(
          res,
          "Éste usuario no tiene permisos para acceder a la sala como Observador",
          400
        );
      }
    }

    return success(res, room, "Consulta realizada", 200);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const getAllRooms = async (req, res) => {
  try {
    const decodedToken = decodeToken(
      req.headers["authorization"]?.split(" ")[1]
    );

    const allRooms = await roomService.getAllRooms(decodedToken);

    return success(res, allRooms, "Consulta realizada", 200);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

module.exports = {
  addRoom,
  updateRoom,
  getRoomById,
  getAllRooms,
  getRoomByRoomId,
};
