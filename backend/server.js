const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ===============================
// ✅ Middleware
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// ===============================
// ✅ MongoDB Connection
// ===============================
mongoose
  .connect("mongodb://127.0.0.1:27017/campusconnect")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ===============================
// ✅ CREATE UPLOADS FOLDER
// ===============================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===============================
// ✅ MODELS
// ===============================

// 👤 USER
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// ❓ QUESTION
const questionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    postedBy: String,
    role: String,
    file: String,
    views: { type: Number, default: 0 }, // ✅ ADD THIS
    answer: String,
    answeredBy: String,
  },
  { timestamps: true }
);
const Question = mongoose.model("Question", questionSchema);

// 📄 NOTES
const noteSchema = new mongoose.Schema({
  title: String,
  topic: String,
  file: String,
  uploadedBy: String,
});
const Note = mongoose.model("Note", noteSchema);

// ===============================
// ✅ FILE UPLOAD (MULTER)
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===============================
// ✅ ROUTES
// ===============================

// 🔹 TEST
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ===============================
// 🔐 REGISTER
// ===============================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// 🔐 LOGIN
// ===============================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ❓ ADD QUESTION (FIXED)
// ===============================
app.post("/api/questions", upload.single("file"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description, category, postedBy, role } = req.body;

    const q = new Question({
      title,
      description,
      category,
      postedBy,
      role,
      file: req.file ? req.file.filename : null,
    });

    await q.save();

    res.json(q);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ===============================
// 📥 GET QUESTIONS
// ===============================
app.get("/api/questions", async (req, res) => {
  try {
    const data = await Question.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/questions/view/:id", async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // ✅ increase view
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ===============================
// 💬 ADD ANSWER (FIXED)
// ===============================
app.post("/api/answer/:id", async (req, res) => {
  try {
    const { answer, answeredBy } = req.body;

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { answer, answeredBy },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// 📄 UPLOAD NOTES
// ===============================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, topic, uploadedBy } = req.body;

    const note = new Note({
      title,
      topic,
      file: req.file.filename,
      uploadedBy,
    });

    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Upload error" });
  }
});

// ===============================
// 📥 GET NOTES
// ===============================
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// ===============================
// 🔍 SEARCH NOTES
// ===============================
app.get("/api/notes/search", async (req, res) => {
  const { topic } = req.query;

  const notes = await Note.find({
    topic: { $regex: topic, $options: "i" },
  });

  res.json(notes);
});

// ===============================
// 📂 STATIC FILE ACCESS
// ===============================
app.use("/uploads", express.static("uploads"));

// ===============================
// 🚀 START SERVER
// ===============================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});