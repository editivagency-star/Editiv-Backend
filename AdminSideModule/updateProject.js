const Project = require("../models/Project");
const Client = require("../models/Client");
const sendEmail = require("../config/sendEmail");

const buildMilestoneHtml = (clientName, projectTitle, percent) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Project Milestone</title>
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
      .progress-wrap { background: #111111; border-radius: 8px; padding: 24px 28px; margin-bottom: 28px; border: 1px solid #1a1a1a; }
      .progress-label { font-size: 13px; color: #aaaaaa; margin-bottom: 10px; }
      .progress-bar-bg { background: #1a1a1a; border-radius: 99px; height: 10px; width: 100%; }
      .progress-bar-fill { background: #00ff9c; border-radius: 99px; height: 10px; width: ${percent}%; }
      .progress-pct { font-size: 28px; font-weight: 800; color: #00ff9c; margin-top: 12px; }
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
        <div class="badge">🎯 Milestone Reached</div>
        <div class="greeting">${percent >= 100 ? "Your project is complete! 🎉" : "Your project has hit 50% progress!"}</div>
        <p class="text">Hi ${clientName}, great news! Your project <strong style="color:#ffffff;">${projectTitle}</strong> has reached a major milestone.</p>
        <div class="progress-wrap">
          <div class="progress-label">Overall Progress</div>
          <div class="progress-bar-bg"><div class="progress-bar-fill"></div></div>
          <div class="progress-pct">${percent}%</div>
        </div>
        <a href="https://editiv.com/client/login" class="btn">${percent >= 100 ? "View Final Deliverables →" : "Track Your Progress →"}</a>
        <p class="text" style="margin-bottom:0;">${percent >= 100 ? "Log in to your portal to download your final deliverables. Thank you for choosing EditIV!" : "Log in to your portal to see the latest updates and what's coming next."}</p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} EditIV. All rights reserved.</div>
    </div>
  </body>
  </html>
`;

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      progressPercent,
      startDate,
      deadline,
      teamMembers,
      tasks,
      clientNotes,
      newDeliverable,
    } = req.body;

    const project = await Project.findById(id).populate("client", "name email");
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (progressPercent !== undefined) project.progressPercent = Number(progressPercent);
    if (startDate !== undefined) project.startDate = startDate;
    if (deadline !== undefined) project.deadline = deadline;
    if (teamMembers !== undefined) project.teamMembers = teamMembers;
    if (tasks !== undefined) project.tasks = tasks;
    if (clientNotes !== undefined) project.clientNotes = clientNotes;

    // Handle new deliverable if provided inline (without file upload)
    if (newDeliverable && newDeliverable.label && newDeliverable.url) {
      project.deliverables.push({
        label: newDeliverable.label,
        url: newDeliverable.url,
        publicId: newDeliverable.publicId || "",
        sharedAt: Date.now(),
      });
    }

    await project.save();

    // Milestone email logic
    const client = project.client;
    const pct = project.progressPercent;

    if (pct >= 100 && !project.milestoneEmails.sent100) {
      project.milestoneEmails.sent100 = true;
      await project.save();
      await sendEmail({
        to: client.email,
        subject: "🎉 Your project is complete! — EditIV",
        html: buildMilestoneHtml(client.name, project.title, 100),
      });
    } else if (pct >= 50 && !project.milestoneEmails.sent50) {
      project.milestoneEmails.sent50 = true;
      await project.save();
      await sendEmail({
        to: client.email,
        subject: "🎯 Your project has hit 50% progress! — EditIV",
        html: buildMilestoneHtml(client.name, project.title, 50),
      });
    }

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
