const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const noteRoutes = require("./routes/notes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/campusconnect")
  .then(() => console.log("MongoDB Connected ✅"));

// File Upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/notes", noteRoutes);

// Upload Route
const Note = require("./models/Note");

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { title, topic, uploadedBy } = req.body;

  const newNote = new Note({
    title,
    topic,
    file: req.file.filename,
    uploadedBy,
  });

  await newNote.save();

  res.json(newNote);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});