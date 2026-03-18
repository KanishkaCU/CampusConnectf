const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// GET NOTES
router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// SEARCH NOTES
router.get("/search", async (req, res) => {
  const { topic } = req.query;

  const notes = await Note.find({
    topic: { $regex: topic, $options: "i" },
  });

  res.json(notes);
});

module.exports = router;