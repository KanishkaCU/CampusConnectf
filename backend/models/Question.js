const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  answer: String,
  answeredBy: String,
});

module.exports = mongoose.model("Question", questionSchema);