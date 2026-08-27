const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    postedBy: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    answeredBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    file: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: String,
      required: true,
    },

    uploadedByRole: {
      type: String,
      default: "Student",
    },

    likes: {
      type: [String],
      default: [],
    },

    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Note", noteSchema);