const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("./models/User");
const Note = require("./models/Note");
const Comment = require("./models/Comment");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// MONGODB
// ==========================================

mongoose
  .connect("mongodb://127.0.0.1:27017/campusconnect")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));


// ==========================================
// UPLOADS
// ==========================================

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// ==========================================
// MULTER
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.send("Campus Connect Backend Running 🚀");
});


// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    res.json({
      message: "Registered successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({ user });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// NOTES
// ==========================================


// ------------------------------------------
// UPLOAD NOTE
// BOTH SENIOR AND JUNIOR CAN UPLOAD
// ------------------------------------------

app.post(
  "/api/notes",
  upload.single("file"),
  async (req, res) => {
    try {
      const {
        title,
        topic,
        uploadedBy,
        uploadedByRole,
      } = req.body;

      if (!title || !topic || !uploadedBy) {
        return res.status(400).json({
          message: "Title, topic and uploader are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please select a file",
        });
      }

      const note = new Note({
        title,
        topic,
        file: req.file.filename,
        uploadedBy,
        uploadedByRole,
      });

      await note.save();

      res.json(note);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to upload note",
      });
    }
  }
);


// ------------------------------------------
// GET ALL NOTES
// ------------------------------------------

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find()
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get notes",
    });
  }
});

// =====================================
// GET SINGLE NOTE
// =====================================

app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// =====================================
// GET QUESTIONS FOR NOTE
// =====================================

app.get("/api/notes/:id/questions", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note.questions || []);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================
// ASK QUESTION ABOUT NOTE
// =====================================

app.post("/api/notes/:id/questions", async (req, res) => {
  try {
    const {
      question,
      postedBy,
      role,
    } = req.body;

    if (!question || !postedBy) {
      return res.status(400).json({
        message: "Question and user are required",
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.questions.push({
      question,
      postedBy,
      role,
    });

    await note.save();

    res.status(201).json(
      note.questions[note.questions.length - 1]
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================================
// ANSWER NOTE QUESTION
// =====================================

app.put(
  "/api/notes/:id/questions/:questionId/answer",
  async (req, res) => {
    try {
      const {
        answer,
        answeredBy,
      } = req.body;

      const note = await Note.findById(req.params.id);

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      const question = note.questions.id(
        req.params.questionId
      );

      if (!question) {
        return res.status(404).json({
          message: "Question not found",
        });
      }

      question.answer = answer;
      question.answeredBy = answeredBy;

      await note.save();

      res.json(question);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);
// ------------------------------------------
// GET ONE NOTE
// ------------------------------------------

app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(note);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get note",
    });
  }
});


// ------------------------------------------
// LIKE / UNLIKE NOTE
// ------------------------------------------

app.put("/api/notes/:id/like", async (req, res) => {
  try {
    const { username } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const alreadyLiked =
      note.likes.includes(username);

    if (alreadyLiked) {
      note.likes = note.likes.filter(
        (user) => user !== username
      );
    } else {
      note.likes.push(username);
    }

    await note.save();

    res.json(note);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to like note",
    });
  }
});


// ==========================================
// COMMENTS
// ==========================================


// ------------------------------------------
// ADD COMMENT TO NOTE
// ------------------------------------------

app.post(
  "/api/notes/:noteId/comments",
  async (req, res) => {
    try {
      const {
        user,
        role,
        text,
      } = req.body;

      const { noteId } = req.params;

      if (!user || !text || !text.trim()) {
        return res.status(400).json({
          message: "Comment cannot be empty",
        });
      }

      const note = await Note.findById(noteId);

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      const comment = new Comment({
        noteId,
        user,
        role,
        text: text.trim(),
      });

      await comment.save();

      res.json(comment);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to add comment",
      });
    }
  }
);


// ------------------------------------------
// GET COMMENTS FOR NOTE
// ------------------------------------------

app.get(
  "/api/notes/:noteId/comments",
  async (req, res) => {
    try {
      const comments = await Comment.find({
        noteId: req.params.noteId,
      }).sort({ createdAt: 1 });

      res.json(comments);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to get comments",
      });
    }
  }
);


// ------------------------------------------
// REPLY TO COMMENT
// ------------------------------------------

app.put(
  "/api/comments/:commentId/reply",
  async (req, res) => {
    try {
      const {
        reply,
        repliedBy,
      } = req.body;

      if (!reply || !reply.trim()) {
        return res.status(400).json({
          message: "Reply cannot be empty",
        });
      }

      const comment = await Comment.findById(
        req.params.commentId
      );

      if (!comment) {
        return res.status(404).json({
          message: "Comment not found",
        });
      }

      const note = await Note.findById(
        comment.noteId
      );

      if (!note) {
        return res.status(404).json({
          message: "Note not found",
        });
      }

      // Only the person who uploaded the note
      // can reply to comments on that note.

      if (note.uploadedBy !== repliedBy) {
        return res.status(403).json({
          message:
            "Only the note owner can reply",
        });
      }

      comment.reply = reply.trim();
      comment.repliedBy = repliedBy;

      await comment.save();

      res.json(comment);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to reply",
      });
    }
  }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(5000, () => {
  console.log(
    "Server running on http://localhost:5000"
  );
});