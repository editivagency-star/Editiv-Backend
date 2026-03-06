const Portfolio = require("../models/Portfolio");
const cloudinary = require("../config/cloudinary");

module.exports = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Not found" });

    const publicId = item.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    await Portfolio.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
