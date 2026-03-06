
const Folder = require("../models/Folder");

module.exports = async (req,res)=>{
  const data = await Folder.find().sort({createdAt:-1});
  res.json(data);
};
