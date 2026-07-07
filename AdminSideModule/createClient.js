const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const sendEmail = require("../config/sendEmail");

module.exports = async (req, res) => {
  try {
    const { name, email, password, phone, companyName } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email, and password are required" });

    const exists = await Client.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Client with this email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const client = await Client.create({
      name,
      email,
      password: hashed,
      phone,
      companyName,
      createdBy: req.admin?.id || null,
    });

    // Send welcome email with credentials
    const welcomeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Welcome to EditIV</title>
        <style>
          body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .wrapper { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
          .header { padding: 40px 40px 20px; border-bottom: 1px solid #1a1a1a; }
          .logo { font-size: 28px; font-weight: 800; color: #00ff9c; letter-spacing: 2px; }
          .logo span { color: #ffffff; }
          .body { padding: 40px; }
          .greeting { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
          .text { font-size: 15px; color: #aaaaaa; line-height: 1.7; margin-bottom: 24px; }
          .credentials-box { background: #111111; border: 1px solid #00ff9c22; border-left: 3px solid #00ff9c; border-radius: 8px; padding: 24px 28px; margin-bottom: 28px; }
          .cred-label { font-size: 11px; font-weight: 700; color: #00ff9c; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
          .cred-value { font-size: 15px; color: #ffffff; margin-bottom: 16px; font-family: monospace; }
          .cred-value:last-child { margin-bottom: 0; }
          .btn { display: inline-block; background: #00ff9c; color: #0a0a0a; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 6px; text-decoration: none; letter-spacing: 0.5px; margin-bottom: 32px; }
          .footer { padding: 24px 40px; border-top: 1px solid #1a1a1a; font-size: 12px; color: #555555; text-align: center; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <div class="logo">EDIT<span>IV</span></div>
          </div>
          <div class="body">
            <div class="greeting">Welcome to EditIV, ${name}! 🎬</div>
            <p class="text">Your client portal account has been created. You can now log in to track your projects, view deliverables, and stay updated on your project progress.</p>
            <div class="credentials-box">
              <div class="cred-label">Your Login Credentials</div>
              <div class="cred-label" style="margin-top:16px;">Email</div>
              <div class="cred-value">${email}</div>
              <div class="cred-label">Password</div>
              <div class="cred-value">${password}</div>
            </div>
            <a href="https://editiv.com/client/login" class="btn">Access Your Portal →</a>
            <p class="text" style="margin-bottom:0;">Please keep your credentials safe. If you have any questions, reply to this email or contact us directly.</p>
          </div>
          <div class="footer">© ${new Date().getFullYear()} EditIV. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "🎬 Welcome to EditIV — Your Client Portal is Ready",
      html: welcomeHtml,
    });

    const clientResponse = client.toObject();
    delete clientResponse.password;

    res.status(201).json({ message: "Client created successfully", client: clientResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
