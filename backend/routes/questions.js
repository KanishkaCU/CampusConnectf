const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// ADD QUESTION
router.post("/", async (req, res) => {
  const { title, description } = req.body;

  const newQ = new Question({ title, description });
  await newQ.save();

  res.json(newQ);
});

// GET QUESTIONS
router.get("/", async (req, res) => {
  const data = await Question.find();
  res.json(data);
});

// ADD ANSWER
router.post("/answer/:id", async (req, res) => {
  const { answer, answeredBy } = req.body;

  const updated = await Question.findByIdAndUpdate(
    req.params.id,
    { answer, answeredBy },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;