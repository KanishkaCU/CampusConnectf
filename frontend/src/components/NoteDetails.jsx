import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "./Layout";

function NoteDetails({ search, setSearch }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =====================================
  // LOAD NOTE
  // =====================================

  const loadNote = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${id}`
      );

      const data = await res.json();

      if (res.ok) {
        setNote(data);
      } else {
        alert(data.message || "Note not found");
        navigate("/notes");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load note");
    }
  };

  // =====================================
  // LOAD QUESTIONS
  // =====================================

  const loadQuestions = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${id}/questions`
      );

      const data = await res.json();

      if (res.ok) {
        setQuestions(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadNote();
      await loadQuestions();
      setLoading(false);
    };

    loadData();
  }, [id]);

  // =====================================
  // ASK QUESTION
  // =====================================

  const handleAskQuestion = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!question.trim()) {
      alert("Please type your question");
      return;
    }

    try {
      setSending(true);

      const res = await fetch(
        `http://localhost:5000/api/notes/${id}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            postedBy: user.name,
            role: user.role,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setQuestion("");
        await loadQuestions();
        alert("Question posted successfully! 💬");
      } else {
        alert(
          data.message || "Failed to ask question"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setSending(false);
    }
  };

  // =====================================
  // ANSWER QUESTION
  // =====================================

  const handleAnswer = async (questionId, answerText) => {
    if (!answerText?.trim()) {
      alert("Please write an answer");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${id}/questions/${questionId}/answer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: answerText,
            answeredBy: user.name,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setQuestions((prev) =>
          prev.map((item) =>
            item._id === questionId ? data : item
          )
        );
      } else {
        alert(
          data.message || "Failed to answer"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <Layout
        search={search}
        setSearch={setSearch}
      >
        <div className="card">
          <p>Loading note...</p>
        </div>
      </Layout>
    );
  }

  if (!note) {
    return null;
  }

  // =====================================
  // PAGE
  // =====================================

  return (
    <Layout
      search={search}
      setSearch={setSearch}
    >
      <div className="note-details-page">

        {/* HEADER */}

        <div className="note-details-header">
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Notes
          </button>
        </div>

        {/* NOTE CARD */}

        <div className="note-details-card">

          <div className="note-details-top">

            <div className="note-icon">
              📄
            </div>

            <div>
              <h2>{note.title}</h2>

              <p>{note.topic}</p>
            </div>

          </div>

          {/* UPLOADER */}

          <div className="note-uploader">

            <div className="avatar small">
              {note.uploadedBy
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div>
              <strong>
                {note.uploadedBy}
              </strong>

              <span>
                {note.uploadedByRole ||
                  "Student"}
              </span>
            </div>

          </div>

          {/* FILE */}

          <div className="note-file-box">

            <div>
              <strong>
                📎 Study Material
              </strong>

              <p>{note.file}</p>
            </div>

            <a
              href={`http://localhost:5000/uploads/${note.file}`}
              target="_blank"
              rel="noreferrer"
              className="note-download-btn"
            >
              📥 Open / Download
            </a>

          </div>

        </div>

        {/* ASK QUESTION */}

        <div className="note-question-card">

          <h3>
            💬 Ask a Question
          </h3>

          <p>
            Have a doubt about this note?
            Ask the person who uploaded it.
          </p>

          <textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
          />

          <div className="question-actions">

            <button
              className="post-submit-btn"
              onClick={handleAskQuestion}
              disabled={sending}
            >
              {sending
                ? "Posting..."
                : "💬 Ask Question"}
            </button>

          </div>

        </div>

        {/* QUESTIONS */}

        <div className="note-questions-card">

          <div className="questions-heading">

            <div>
              <h3>
                Questions & Answers
              </h3>

              <p>
                {questions.length} question
                {questions.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

          </div>

          {/* NO QUESTIONS */}

          {questions.length === 0 ? (

            <div className="no-questions">

              <div>💬</div>

              <h4>
                No questions yet
              </h4>

              <p>
                Be the first person to ask
                something about this note.
              </p>

            </div>

          ) : (

            /* QUESTIONS */

            questions.map((q) => (

              <QuestionItem
                key={q._id}
                q={q}
                note={note}
                user={user}
                onAnswer={handleAnswer}
              />

            ))

          )}

        </div>

      </div>
    </Layout>
  );
}


// =====================================
// QUESTION COMPONENT
// =====================================

function QuestionItem({
  q,
  note,
  user,
  onAnswer,
}) {

  const [answerText, setAnswerText] =
    useState("");

  const isOwner =
    user?.name === note?.uploadedBy;

  return (
    <div className="note-question">

      {/* QUESTION USER */}

      <div className="question-user">

        <div className="avatar small">
          {q.postedBy
            ?.charAt(0)
            .toUpperCase() || "U"}
        </div>

        <div>

          <strong>
            {q.postedBy}
          </strong>

          <span>
            {q.role}
          </span>

        </div>

      </div>

      {/* QUESTION */}

      <p className="question-text">
        ❓ {q.question}
      </p>

      {/* ALREADY ANSWERED */}

      {q.answer ? (

        <div className="note-answer">

          <div className="answer-label">
            ✅ Answer
          </div>

          <p>
            {q.answer}
          </p>

          <small>
            Answered by {q.answeredBy}
          </small>

        </div>

      ) : (

        /* NOT ANSWERED */

        <>
          {isOwner ? (

            /* NOTE OWNER */

            <div className="owner-answer-box">

              <p className="answer-label">
                ✍️ Answer this question
              </p>

              <textarea
                placeholder="Write your answer..."
                value={answerText}
                onChange={(e) =>
                  setAnswerText(
                    e.target.value
                  )
                }
              />

              <button
                className="post-submit-btn"
                onClick={() => {

                  onAnswer(
                    q._id,
                    answerText
                  );

                  setAnswerText("");

                }}
              >
                ✅ Submit Answer
              </button>

            </div>

          ) : (

            /* OTHER USERS */

            <p className="waiting-answer">
              ⏳ Waiting for the note owner
              to answer
            </p>

          )}

        </>

      )}

    </div>
  );
}

export default NoteDetails;