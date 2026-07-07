const Project = require("../models/Project");

module.exports = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "client",
      "name email phone companyName isActive"
    );

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
