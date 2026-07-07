const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "email and password are required" });

    const client = await Client.findOne({ email });
    if (!client)
      return res.status(401).json({ message: "Invalid email or password" });

    if (!client.isActive)
      return res.status(403).json({ message: "Your account has been deactivated. Please contact support." });

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: client._id, email: client.email, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        companyName: client.companyName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
