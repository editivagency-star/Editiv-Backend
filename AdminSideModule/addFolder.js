const Folder = require("../models/Folder");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

module.exports = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
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

    const folder = await Folder.create({
      name,
      coverImage: result.secure_url,
    });

    res.json(folder);

  } catch (err) {
    console.error("Add folder error:", err);
    res.status(500).json({ error: err.message });
  }
};
