import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ViewAnswers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((q) => q._id === id);
        setQuestion(found);
      });
  }, [id]);

  const handleAnswer = async () => {
    if (!answer) return alert("Enter answer");

    const res = await fetch(`http://localhost:5000/api/answer/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
        answeredBy: user.name,
      }),
    });

    const data = await res.json();
    setQuestion(data);
    setAnswer("");
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="page-center">
      <div className="card">
        <h3>{question.title}</h3>

        <p><b>Question:</b> {question.description}</p>
        <p><b>Answer:</b> {question.answer || "No answer yet"}</p>

        {user?.role === "Senior" && (
          <>
            <textarea
              placeholder="Write your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button className="btn" onClick={handleAnswer}>
              Submit Answer
            </button>
          </>
        )}

        {/* ✅ FIXED HERE */}
        <Link className="btn" to="/dashboard">
          Back
        </Link>
      </div>
    </div>
  );
}

export default ViewAnswers;