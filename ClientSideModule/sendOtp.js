const Otp = require("../models/Otp");
const sendEmail = require("../config/sendEmail");

module.exports = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTPs for this email address
    await Otp.deleteMany({ email: cleanEmail });

    // Save new OTP
    await Otp.create({
      email: cleanEmail,
      otp,
    });

    // Send OTP email via Resend
    await sendEmail({
      to: cleanEmail,
      subject: "🔒 Verification Code — EDiTiV",
      html: `
        <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#0b0f17; color:#ffffff; padding:40px 20px; border-radius:16px; max-width:520px; margin:0 auto; border:1px solid #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <div style="text-align:center; margin-bottom:28px;">
            <div style="display:inline-block; background:linear-gradient(135deg, #00ff88, #00b8ff); padding:2px; border-radius:12px; margin-bottom:12px;">
              <div style="background:#0b0f17; padding:8px 18px; border-radius:10px;">
                <h1 style="font-size:24px; font-weight:800; color:#00ff88; margin:0; letter-spacing:2px;">EDiTiV</h1>
              </div>
            </div>
            <p style="color:#94a3b8; font-size:14px; margin:6px 0 0; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Email Verification</p>
          </div>

          <div style="background:#131c2e; border:1px solid #1e2d4a; border-radius:14px; padding:28px; text-align:center; margin-bottom:24px;">
            <p style="color:#cbd5e1; font-size:15px; margin:0 0 16px;">Use the following 6-digit verification code to complete your form submission:</p>
            
            <div style="font-size:36px; font-weight:900; letter-spacing:10px; color:#00ff88; background:#070a0f; border:1px dashed #00ff88; border-radius:12px; padding:16px 20px; display:inline-block; margin:8px 0; box-shadow: 0 0 20px rgba(0,255,136,0.15);">
              ${otp}
            </div>

            <p style="color:#64748b; font-size:13px; margin:16px 0 0;">This code will expire in <strong style="color:#94a3b8;">10 minutes</strong>. Do not share this code with anyone.</p>
          </div>

          <p style="color:#475569; font-size:12px; text-align:center; margin:0; border-top:1px solid #1e293b; padding-top:20px;">
            If you did not request this verification code, please ignore this email.<br/>
            © ${new Date().getFullYear()} EDiTiV. All rights reserved.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
    });

  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({
      message: err.message || "Failed to send OTP. Please try again.",
    });
  }
};
