import User from "../models/user.js";
import Pricing from "../models/pricing.js";
//  Add a new doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, availableSlots } = req.body;
    const doctorExist = await User.find({ email: req.params.id });
    if (!doctorExist)
      return res.status(400).json({ message: "Doctor already Exist" });

    const newDoctor = new User({
      name,
      email,
      password,
      role: "doctor",
      specialization,
      availableSlots,
    });

    await newDoctor.save();
    res
      .status(200)
      .json({ message: "Doctor added successfully", doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update doctor details

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, availableSlots } = req.body;

    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Doctor not found" });
    }
    doctor.name = name || doctor.name;
    doctor.specialization = specialization || doctor.specialization;
    doctor.availableSlots = availableSlots || doctor.availableSlots;

    await doctor.save();
    res.json({ message: "Doctor updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Doctor not found" });
    }
    await doctor.deleteOne();
    res.json({ message: "Doctor removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  View all patients
export const getAllPatient = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete a patient

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);
    if (!patient || patient.role !== "patient") {
      res.status(404).json({ message: "Patient not found" });
    }
    await patient.deleteOne();
    res.json({ message: "Patient removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//set pricing

export const setPricing = async (req, res) => {
  try {
    const { consultationFee, doctorId } = req.body;

    if (!consultationFee || doctorId) {
      return res
        .status(400)
        .json({ message: "consultationFee and doctorId are required" });
    }

    const pricing = await Pricing.findOne(doctorId);
    if (!pricing) {
      const newPricing = new Pricing({ consultationFee, doctorId });
      await newPricing.save();

      return res
        .status(201)
        .json({ message: "Pricing set successfully", newPricing });
    }

    pricing.consultationFee = consultationFee;
    await pricing.save();
    res.json({ message: "Pricing updated successfully", pricing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
