const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },

    user: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Student",
    },

    text: {
      type: String,
      required: true,
    },

    reply: {
      type: String,
      default: "",
    },

    repliedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);