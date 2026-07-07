const Client = require("../models/Client");
const Project = require("../models/Project");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);
    if (!client)
      return res.status(404).json({ message: "Client not found" });

    // Delete all projects belonging to this client
    await Project.deleteMany({ client: id });

    await client.deleteOne();

    res.json({ message: "Client and all associated projects deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
