const Folder = require("../models/Folder");
const cloudinary = require("../config/cloudinary");

module.exports = async (req, res) => {
  try {
    const { name } = req.body;
    const folderId = req.params.id;

    let updateData = {};

    if (name) updateData.name = name;

    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "portfolio_folders" },
        async (error, result) => {
          if (error) throw error;

          updateData.coverImage = result.secure_url;

          const updated = await Folder.findByIdAndUpdate(
            folderId,
            updateData,
            { new: true }
          );

          return res.json(updated);
        }
      ).end(req.file.buffer);

      return;
    }

    const updated = await Folder.findByIdAndUpdate(
      folderId,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("Update folder error:", err);
    res.status(500).json({ error: err.message });
  }
};
