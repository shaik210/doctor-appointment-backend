import Appointment from "../models/appointement.js";
import User from "../models/user.js";

// Book an appointment (patient)
export const createAppointemnt = async (req, res) => {
  try {
    const { doctorId, date, time, notes } = req.body;

    if (!doctorId || !date || !time) {
      return res
        .status(400)
        .json({ message: "Doctor ID, date, and time are required." });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res
        .status(400)
        .json({ message: "Invalid doctor ID or user is not a doctor." });
    }

    const existing = await Appointment.findOne({
      doctorId,
      date,
      time,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked." });
    }

    const newAppointment = new Appointment({
      doctorId,
      patientId: req.user.id,
      date,
      time,
      notes,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get my appointment for (for patient and doctorr)
export const getMyAppointment = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "doctor") {
      filter.doctorId = req.user.id;
    } else if (req.user.role === "patient") {
      filter.patientId = req.user.id;
    }
    const appointment = await Appointment.find(filter)
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email")
      .sort({ date: -1 });
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update appointment  status for (doctor/admin)

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatus = ["Scheduled", "Completed", "Cancelled"];
    if (!validStatus)
      return res.status(400).json({ message: "Invalid Status" });
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "No Appoinments " });

    appointment.status = status;
    await appointment.save();
    res.json({ message: "Status Updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete appointmnet (patient /admin)

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    const isAdmin = req.user.role === "admin";
    const isOwner =
      req.user.role === "patient" &&
      appointment.patientId?.toString() === req.user.id;

    if (isAdmin || isOwner) {
      await appointment.deleteOne();
      return res.json({ message: "Appointment deleted successfully" });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: err.message });
  }
};


//update payment status

export const updatePaymentStatus= async(req,res)=>{
try{
  const {id}=req.body;
  const {paymentStatus,paymentDetails}= req.body;

  const appointment = await Appointment.findById(id);

  if(!appointment){
    res.status(400).json({message:'No appointment found'})
  }

appointment.paymentStatus= paymentStatus|| appointment.paymentStatus;
if(paymentStatus){
   appointment.paymentDetails = paymentDetails;
}

 res.json({ message: "Payment status updated", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};