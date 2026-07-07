const Client = require("../models/Client");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, companyName, isActive, newPassword } = req.body;

    const client = await Client.findById(id);
    if (!client)
      return res.status(404).json({ message: "Client not found" });

    if (name !== undefined) client.name = name;
    if (phone !== undefined) client.phone = phone;
    if (companyName !== undefined) client.companyName = companyName;
    if (isActive !== undefined) client.isActive = isActive;

    if (newPassword) {
      client.password = await bcrypt.hash(newPassword, 10);
    }

    await client.save();

    const clientResponse = client.toObject();
    delete clientResponse.password;

    res.json({ message: "Client updated successfully", client: clientResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
