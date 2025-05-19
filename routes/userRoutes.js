import express from "express";
import auth from "../middleware/auth.js";
import role from "../middleware/role.js";
import {
  getAllDoctors,
  getPatientById,
  getprofile,
  updateAvalibility,
} from "../controllers/usercontroller.js";
const router = express.Router();
// Accessible to all authenticated users
router.get("/profile", auth, getprofile);
// Doctors can view list of patients
router.get("/patient/:id", auth, role("doctor"), getPatientById);
// Patients can view list of doctors
// router.get("/doctors", auth, role("patient"), getAllDoctors);
router.get("/doctors",  getAllDoctors);
//update appointmnet availibilty

router.post("/availability", auth, role("doctor"), updateAvalibility);

export default router;
