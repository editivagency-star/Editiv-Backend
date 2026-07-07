const Project = require("../models/Project");

module.exports = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
