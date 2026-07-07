const Client = require("../models/Client");

module.exports = async (req, res) => {
  try {
    const clients = await Client.find().select("-password").sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
