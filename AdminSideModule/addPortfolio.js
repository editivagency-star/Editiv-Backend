const Portfolio = require("../models/Portfolio");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

module.exports = async (req, res) => {
  try {
    const { title, description, folderId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "portfolio" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadFromBuffer();

    const newItem = await Portfolio.create({
      title,
      description,
      folderId,
      image: result.secure_url,
    });

    res.json(newItem);

  } catch (error) {
    console.error("Add portfolio error:", error);
    res.status(500).json({ error: error.message });
  }
};
