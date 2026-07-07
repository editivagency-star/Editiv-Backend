const Invoice = require("../models/Invoice");

module.exports = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice/Quote not found." });
    }
    res.json({ message: "Invoice/Quote deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
