import express from "express";
import auth from "../middleware/auth.js";
import {
  createAppointemnt,
  deleteAppointment,
  getMyAppointment,
  updateAppointment,
  updatePaymentStatus,
} from "../controllers/appointmentController.js";
import role from "../middleware/role.js";
const router = express.Router();

// Book appointment – patient
router.post("/", auth, role("patient"), createAppointemnt);

// View appointments – doctor or patient
// router.get("/", auth, role("doctor", "patient"), getMyAppointment);
router.get("/",  getMyAppointment);

//update appoinment -doctor or admin
router.put("/:id/status", auth, role("doctor", "admin"), updateAppointment);

//delete appointment -doctor or admin
router.delete("/:id", auth, role("patient", "admin"), deleteAppointment);

//update payment status

router.post("/:id",auth,role('patient'),updatePaymentStatus);


export default router;