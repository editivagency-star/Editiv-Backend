const Portfolio = require("../models/Portfolio");

module.exports = async (req, res) => {
  try {
    const { folderId } = req.query;

    let data;

    if (folderId) {
      data = await Portfolio.find({ folderId }).sort({ createdAt: -1 });
    } else {
      data = await Portfolio.find().sort({ createdAt: -1 });
    }

    res.json(data);

  } catch (err) {
    console.error("Get portfolio error:", err);
    res.status(500).json({ error: err.message });
  }
};
