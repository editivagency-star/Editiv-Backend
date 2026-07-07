const Project = require("../models/Project");

module.exports = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email companyName")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
