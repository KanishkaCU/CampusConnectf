const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  topic: String,
  file: String,
  uploadedBy: String,
});

module.exports = mongoose.model("Note", noteSchema);