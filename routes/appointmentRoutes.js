import express from "express";
import auth from "../middleware/auth.js";
import {
  createAppointemnt,
  deleteAppointment,
  getMyAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";
import role from "../middleware/role.js";
const router = express.Router();

// Book appointment – patient
router.post("/", auth, role("patient"), createAppointemnt);

// View appointments – doctor or patient
router.get("/", auth, role("doctor", "patient"), getMyAppointment);

//update appoinment -doctor or admin
router.put("/:id/status", auth, role("doctor", "admin"), updateAppointment);

//delete appointment -doctor or admin
router.delete("/:id", auth, role("patient", "admin"), deleteAppointment);


export default router;