const Project = require("../models/Project");
const Client = require("../models/Client");
const sendEmail = require("../config/sendEmail");

module.exports = async (req, res) => {
  try {
    const {
      title,
      description,
      client: clientId,
      status,
      startDate,
      deadline,
      teamMembers,
      tasks,
      clientNotes,
    } = req.body;

    if (!title || !clientId)
      return res.status(400).json({ message: "title and client are required" });

    const client = await Client.findById(clientId);
    if (!client)
      return res.status(404).json({ message: "Client not found" });

    const project = await Project.create({
      title,
      description,
      client: clientId,
      status,
      startDate,
      deadline,
      teamMembers,
      tasks,
      clientNotes,
    });

    // Send project assignment email to client
    const deadlineStr = deadline
      ? new Date(deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "Not set";

    const statusLabel = {
      not_started: "Not Started",
      in_progress: "In Progress",
      review: "Under Review",
      completed: "Completed",
    }[status] || "Not Started";

    const assignmentHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>New Project Assigned</title>
        <style>
          body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .wrapper { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; }
          .header { padding: 40px 40px 20px; border-bottom: 1px solid #1a1a1a; }
          .logo { font-size: 28px; font-weight: 800; color: #00ff9c; letter-spacing: 2px; }
          .logo span { color: #ffffff; }
          .body { padding: 40px; }
          .greeting { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
          .text { font-size: 15px; color: #aaaaaa; line-height: 1.7; margin-bottom: 24px; }
          .project-box { background: #111111; border: 1px solid #00ff9c22; border-left: 3px solid #00ff9c; border-radius: 8px; padding: 24px 28px; margin-bottom: 28px; }
          .detail-label { font-size: 11px; font-weight: 700; color: #00ff9c; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
          .detail-value { font-size: 15px; color: #ffffff; margin-bottom: 20px; }
          .detail-value:last-child { margin-bottom: 0; }
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
            <div class="greeting">A new project has been assigned to you! 🎬</div>
            <p class="text">Hi ${client.name}, we're excited to let you know that a new project has been created for you on the EditIV portal. Here are the details:</p>
            <div class="project-box">
              <div class="detail-label">Project Title</div>
              <div class="detail-value">${title}</div>
              <div class="detail-label">Status</div>
              <div class="detail-value">${statusLabel}</div>
              <div class="detail-label">Deadline</div>
              <div class="detail-value">${deadlineStr}</div>
              ${description ? `<div class="detail-label">Description</div><div class="detail-value">${description}</div>` : ""}
            </div>
            <a href="https://editiv.com/client/login" class="btn">View Your Project →</a>
            <p class="text" style="margin-bottom:0;">Log in to your portal to track progress, view updates, and access all deliverables as they become available.</p>
          </div>
          <div class="footer">© ${new Date().getFullYear()} EditIV. All rights reserved.</div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: client.email,
      subject: "🎬 A new project has been assigned to you — EditIV",
      html: assignmentHtml,
    });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
