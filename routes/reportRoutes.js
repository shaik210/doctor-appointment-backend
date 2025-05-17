import express from "express";
import upload from "../middleware/upload.js";
import {
  uploadReport,
  getReportsByPatient,
} from "../controllers/reportController.js";
import auth from "../middleware/auth.js";
import roles from "../middleware/role.js";

const router = express.Router();

// POST /reports/upload
router.post("/upload",auth,roles('patient') ,upload.single("file"), uploadReport);

// GET /reports/:patientId
router.get("/:patientID", getReportsByPatient);

export default router;
