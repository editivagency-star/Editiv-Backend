const Otp = require("../models/Otp");

module.exports = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Look up OTP record
    const otpRecord = await Otp.findOne({ email: cleanEmail });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Verification code expired or not found. Please request a new OTP.",
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      return res.status(400).json({
        message: "Invalid verification code. Please check and try again.",
      });
    }

    // OTP matched! Remove record from DB
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: "Email address verified successfully!",
    });

  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({
      message: err.message || "Failed to verify OTP. Please try again.",
    });
  }
};
