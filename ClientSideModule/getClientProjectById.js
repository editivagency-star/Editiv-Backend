const Project = require("../models/Project");

module.exports = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    // Ensure this project belongs to the authenticated client
    if (project.client.toString() !== req.client.id) {
      return res.status(403).json({ message: "Access denied: this project does not belong to you" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
