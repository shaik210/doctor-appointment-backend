import express from "express";
import role from "../middleware/role.js";
import auth from "../middleware/auth.js";
import {
  addDoctor,
  deleteDoctor,
  deletePatient,
  getAllPatient,
  setPricing,
  updateDoctor,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/doctors", auth, role("admin"), addDoctor);
router.put("/doctors/:id", auth, role("admin"), updateDoctor);
router.delete("/doctors/:id", auth, role("admin"), deleteDoctor);

router.get("/patient", auth, role("admin"), getAllPatient);
router.delete("/patient/:id", auth, role("admin"), deletePatient);

router.post("/pricing", auth, role("admin"), setPricing);
export default router;
