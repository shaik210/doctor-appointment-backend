import Report from "../models/report.js";

export const uploadReport = async (req, res) => {
  try {
    const { patientID, reportName } = req.body;
        console.log("Request Body:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const report = new Report({
      patientID,
      doctorId: req.user.id, 
      reportName,
      filePath: req.file.path,
    });

    await report.save();
    res.status(201).json({ message: "Report uploaded successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getReportsByPatient = async (req, res) => {
  try {
    const { patientID } = req.params;
    
    if (!patientID) {
      return res.status(400).json({ message: "patientId is required" });
    }

    const reports = await Report.find({patientID});
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
