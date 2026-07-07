const Invoice = require("../models/Invoice");

module.exports = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("client", "name email companyName")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
