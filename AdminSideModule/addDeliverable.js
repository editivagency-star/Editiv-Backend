const Project = require("../models/Project");
const sendEmail = require("../config/sendEmail");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    if (!label)
      return res.status(400).json({ message: "label is required" });

    const project = await Project.findById(id).populate("client", "name email");
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    // Upload buffer to Cloudinary (supports any file type)
    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "deliverables", resource_type: "auto" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadFromBuffer();

    const deliverable = {
      label,
      url: result.secure_url,
      publicId: result.public_id,
      sharedAt: Date.now(),
    };

    project.deliverables.push(deliverable);
    await project.save();

    const client = project.client;

    const deliverableHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>New File Shared</title>
        <style>
          body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .wrapper { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
          .header { padding: 40px 40px 20px; border-bottom: 1px solid #1a1a1a; }
          .logo { font-size: 28px; font-weight: 800; color: #00ff9c; letter-spacing: 2px; }
          .logo span { color: #ffffff; }
          .body { padding: 40px; }
          .badge { display: inline-block; background: #00ff9c18; border: 1px solid #00ff9c44; color: #00ff9c; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 20px; }
          .greeting { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
          .text { font-size: 15px; color: #aaaaaa; line-height: 1.7; margin-bottom: 24px; }
          .file-box { background: #111111; border: 1px solid #00ff9c22; border-left: 3px solid #00ff9c; border-radius: 8px; padding: 24px 28px; margin-bottom: 28px; }
          .file-label { font-size: 11px; font-weight: 700; color: #00ff9c; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
          .file-name { font-size: 16px; color: #ffffff; font-weight: 600; }
          .btn { display: inline-block; background: #00ff9c; color: #0a0a0a; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 6px; text-decoration: none; letter-spacing: 0.5px; margin-bottom: 32px; }
          .btn-outline { display: inline-block; background: transparent; color: #00ff9c; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 6px; text-decoration: none; border: 1px solid #00ff9c44; margin-left: 12px; margin-bottom: 32px; }
          .footer { padding: 24px 40px; border-top: 1px solid #1a1a1a; font-size: 12px; color: #555555; text-align: center; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <div class="logo">EDIT<span>IV</span></div>
          </div>
          <div class="body">
            <div class="badge">📁 New File Shared</div>
            <div class="greeting">A new file has been shared with you</div>
            <p class="text">Hi ${client.name}, the EditIV team has just shared a new deliverable for your project <strong style="color:#ffffff;">${project.title}</strong>.</p>
            <div class="file-box">
              <div class="file-label">File Label</div>
              <div class="file-name">${label}</div>
            </div>
            <a href="${deliverable.url}" class="btn">Download File →</a>
            <a href="https://editiv.com/client/login" class="btn-outline">View in Portal</a>
            <p class="text" style="margin-bottom:0;">You can also access all your shared files anytime from your client portal.</p>
          </div>
          <div class="footer">© ${new Date().getFullYear()} EditIV. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: client.email,
      subject: `📁 New deliverable shared: ${label} — EditIV`,
      html: deliverableHtml,
    });

    res.status(201).json({ message: "Deliverable added and client notified", deliverable });
  } catch (err) {
    console.error("addDeliverable error:", err);
    res.status(500).json({ error: err.message });
  }
};
