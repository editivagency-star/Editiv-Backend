const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  coverImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Folder", folderSchema);
