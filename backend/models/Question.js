const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    postedBy: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "",
    },

    // ⭐ Which note this question belongs to
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },

    answer: {
      type: String,
      default: "",
    },

    answeredBy: {
      type: String,
      default: "",
    },

    likes: {
      type: [String],
      default: [],
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);