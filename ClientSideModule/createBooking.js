const Booking = require("../models/Booking");
const sendEmail = require("../config/sendEmail");

module.exports = async (req, res) => {
  try {
    const { name, email, phone, message, datetime } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required." });
    }

    // Save to DB
    const booking = await Booking.create({
      name,
      email,
      phone,
      datetime: datetime || null,
      message: message || "",
    });

    // ── Email to ADMIN ──────────────────────────────────────────────
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Contact Form Submission — EDiTiV",
      html: `
        <div style="font-family:sans-serif;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
          <div style="text-align:center;margin-bottom:30px">
            <h1 style="color:#00ff9c;font-size:28px;margin:0">EDiTiV</h1>
            <p style="color:#888;font-size:13px;margin:4px 0 0">New Contact Form Submission</p>
          </div>
          <div style="background:#111;border:1px solid #1a1a1a;border-radius:10px;padding:28px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;width:120px">Name</td>
                <td style="padding:10px 0;color:#fff;font-weight:600">${name}</td>
              </tr>
              <tr style="border-top:1px solid #1e1e1e">
                <td style="padding:10px 0;color:#888;font-size:13px">Email</td>
                <td style="padding:10px 0;color:#00ff9c">${email}</td>
              </tr>
              <tr style="border-top:1px solid #1e1e1e">
                <td style="padding:10px 0;color:#888;font-size:13px">Phone</td>
                <td style="padding:10px 0;color:#fff">${phone}</td>
              </tr>
              ${message ? `
              <tr style="border-top:1px solid #1e1e1e">
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top">Message</td>
                <td style="padding:10px 0;color:#ccc;line-height:1.6">${message}</td>
              </tr>` : ""}
            </table>
          </div>
          <p style="color:#555;font-size:12px;text-align:center;margin-top:24px">
            Submitted on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </p>
        </div>
      `,
    });

    // ── Confirmation email to USER ──────────────────────────────────
    await sendEmail({
      to: email,
      subject: "We got your message — EDiTiV 🎬",
      html: `
        <div style="font-family:sans-serif;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
          <div style="text-align:center;margin-bottom:30px">
            <h1 style="color:#00ff9c;font-size:28px;margin:0">EDiTiV</h1>
            <p style="color:#888;font-size:13px;margin:4px 0 0">Elite Video Editing Agency</p>
          </div>

          <h2 style="color:#fff;font-size:22px;margin:0 0 12px">Hey ${name}, we received your message! 👋</h2>
          <p style="color:#bbb;line-height:1.7;margin:0 0 24px">
            Thanks for reaching out to EDiTiV. We'll review your details and get back to you
            within <strong style="color:#00ff9c">24 hours</strong>. In the meantime, feel free to
            check out our work below.
          </p>

          <div style="background:#111;border:1px solid #1a1a1a;border-radius:10px;padding:20px;margin-bottom:28px">
            <p style="color:#555;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Your submission</p>
            <p style="margin:4px 0;color:#ccc"><span style="color:#888">Name: </span>${name}</p>
            <p style="margin:4px 0;color:#ccc"><span style="color:#888">Email: </span>${email}</p>
            <p style="margin:4px 0;color:#ccc"><span style="color:#888">Phone: </span>${phone}</p>
            ${message ? `<p style="margin:8px 0 0;color:#ccc"><span style="color:#888">Message: </span>${message}</p>` : ""}
          </div>

          <div style="text-align:center;margin-bottom:28px">
            <a href="https://editiv.com" style="display:inline-block;background:#00ff9c;color:#000;font-weight:700;padding:14px 36px;border-radius:40px;text-decoration:none;font-size:15px">
              View Our Portfolio →
            </a>
          </div>

          <p style="color:#444;font-size:12px;text-align:center;border-top:1px solid #1a1a1a;padding-top:20px;margin:0">
            © ${new Date().getFullYear()} EDiTiV. All Rights Reserved. &nbsp;|&nbsp;
            <a href="https://editiv.com" style="color:#00ff9c;text-decoration:none">editiv.com</a>
          </p>
        </div>
      `,
    });

    res.json({ message: "Form submitted successfully! Check your email for confirmation." });

  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ error: err.message });
  }
};
