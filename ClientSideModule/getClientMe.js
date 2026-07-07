const Client = require("../models/Client");

module.exports = async (req, res) => {
  try {
    const client = await Client.findById(req.client.id).select("-password");

    if (!client)
      return res.status(404).json({ message: "Client not found" });

    res.json({ client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
