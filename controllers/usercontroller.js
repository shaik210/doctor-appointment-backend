import User from "../models/user.js";

//get all doctors

export const getAllDoctors = async (req, res) => {
  try {
    const {
      search = "",
      specialization = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {
      role: "doctor",
    };

    if (search && specialization) {
      // BOTH search & specialization applied
      filter.$and = [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        { specialization: { $regex: specialization, $options: "i" } },
      ];
    } else if (search) {
      // Only search
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    } else if (specialization) {
      // Only specialization
      filter.specialization = { $regex: specialization, $options: "i" };
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const doctors = await User.find(filter)
      .select("-password")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      doctors,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get patient by Id

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patients = await User.findOne({ _id: id, role: "patient" }).select(
      "-password"
    );

    if (!patients)
      return res.status(404).json({ message: "Patient not found" });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// check avilability

export const updateAvalibility = async (req, res) => {
  try {
    const { date, slots } = req.body;

    if (!date || !Array.isArray(slots) || slots.length === 0) {
      return res
        .status(400)
        .json({ message: "Both date and slots are required" });
    }

    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Clean existing bad slots (optional but recommended)
    doctor.availableSlots = doctor.availableSlots.filter(
      (slot) => slot.date && Array.isArray(slot.slots)
    );

    // Push new slot
    doctor.availableSlots.push({
      date: String(date),
      slots: slots.map((s) => String(s)),
    });

    await doctor.save();

    res.status(200).json({
      message: "Availability added",
      availableSlots: doctor.availableSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//get profile
export const getprofile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
