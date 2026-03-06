const Booking = require("../models/Booking");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.json({ message: "Booking deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
