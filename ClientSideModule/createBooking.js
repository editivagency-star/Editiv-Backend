const Booking = require("../models/Booking");
const sendEmail = require("../config/sendEmail"); // we’ll create this

module.exports = async (req, res) => {
  try {
    const { name, email, phone, datetime, message } = req.body;

    if(!name || !email || !phone || !datetime){
      return res.status(400).json({ message: "Required fields missing" });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      datetime,
      message
    });

    // Send email to owner
    await sendEmail({
      subject: "New Call Booking",
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Date & Time: ${datetime}
Message: ${message}
      `
    });

    res.json({ message: "Booking submitted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
