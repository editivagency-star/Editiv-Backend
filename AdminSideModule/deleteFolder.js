const Folder = require("../models/Folder");
const Portfolio = require("../models/Portfolio");

module.exports = async (req,res)=>{
  const folderId = req.params.id;

  await Portfolio.deleteMany({ folderId });
  await Folder.findByIdAndDelete(folderId);

  res.json({ success:true });
};
