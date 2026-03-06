const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashed
    });

    res.json({ message: "Admin created", admin });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
