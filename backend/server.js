const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

// ===============================
// ✅ Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// ✅ MongoDB Connection
// ===============================
mongoose
  .connect("mongodb://127.0.0.1:27017/campusconnect")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// ===============================
// ✅ MODELS
// ===============================

// 👤 User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// ❓ Question Model
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  answer: String,
  answeredBy: String,
});
const Question = mongoose.model("Question", questionSchema);

// 📄 Notes Model
const noteSchema = new mongoose.Schema({
  title: String,
  file: String,
  uploadedBy: String,
});
const Note = mongoose.model("Note", noteSchema);

// ===============================
// 📁 FILE UPLOAD CONFIG
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

// serve files
app.use("/uploads", express.static("uploads"));

// ===============================
// ✅ ROUTES
// ===============================

// 🔹 Test
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ===============================
// 🔐 REGISTER
// ===============================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.json({ message: "Registered successfully" });
  } catch (error) {
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
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ❓ ADD QUESTION
// ===============================
app.post("/api/questions", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newQuestion = new Question({ title, description });
    await newQuestion.save();

    res.json({
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ✅ ADD ANSWER
// ===============================
app.post("/api/answer/:id", async (req, res) => {
  try {
    const { answer, answeredBy } = req.body;

    if (!answer) {
      return res.status(400).json({ message: "Answer required" });
    }

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { answer, answeredBy },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// 📥 GET QUESTIONS
// ===============================
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// 📄 UPLOAD NOTES
// ===============================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, uploadedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const newNote = new Note({
      title,
      file: req.file.filename,
      uploadedBy,
    });

    await newNote.save();

    res.json({ message: "File uploaded", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Upload error" });
  }
});

// ===============================
// 📥 GET NOTES
// ===============================
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// 🚀 START SERVER
// ===============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});