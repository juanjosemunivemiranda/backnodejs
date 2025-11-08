const { Router } = require("express");
const authMiddleware = require("../utils/authMiddleWare");
const {
  addEducationalInstitution,
  getAllEducationalInstitution,
  updateEducationalInstitution,
  changeStatusEducationalInstitution,
  getIdNameEducationalInstitution,
} = require("../controllers/educationalInstitution.controller");

const router = Router();

router.post(
  "/add",
  authMiddleware("CREATE_EDUCATIONAL_INSTITUTION"),
  addEducationalInstitution
);

router.post(
  "/getAll",
  authMiddleware("GET_EDUCATIONAL_INSTITUTION"),
  getAllEducationalInstitution
);

router.post(
  "/update",
  authMiddleware("UPDATE_EDUCATIONAL_INSTITUTION"),
  updateEducationalInstitution
);

router.post(
  "/changeStatus",
  authMiddleware("UPDATE_EDUCATIONAL_INSTITUTION"),
  changeStatusEducationalInstitution
);

router.post(
  "/getIdNames",
  authMiddleware("GET_EDUCATIONAL_INSTITUTION"),
  getIdNameEducationalInstitution
);

module.exports = router;
