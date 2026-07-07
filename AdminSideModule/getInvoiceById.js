const Invoice = require("../models/Invoice");

module.exports = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "client",
      "name email companyName phone"
    );
    if (!invoice) {
      return res.status(404).json({ message: "Invoice/Quote not found." });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
