import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewAnswers() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // DEBUG
  console.log("ID:", id);
  console.log("USER:", user);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);

        const found = data.find((q) => q._id === id);

        if (!found) {
          console.log("Question not found");
        }

        setQuestion(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleAnswer = async () => {
    if (!answer) {
      alert("Enter answer");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/answer/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer,
          answeredBy: user?.name,
        }),
      });

      const data = await res.json();
      setQuestion(data);
      setAnswer("");

      alert("Answer submitted!");
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 VERY IMPORTANT FIX
  if (!question) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading or Question not found...</p>
        <button onClick={() => navigate("/dashboard")}>Back</button>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="card">
        <h3>{question.title}</h3>

        <p><b>Question:</b> {question.description}</p>

        <p>
          <b>Answer:</b>{" "}
          {question.answer ? question.answer : "No answer yet"}
        </p>

        <p>
          <b>Answered By:</b>{" "}
          {question.answeredBy ? question.answeredBy : "N/A"}
        </p>

        {/* ✅ SHOW ONLY FOR SENIOR */}
        {user && user.role === "Senior" && (
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

        <button className="btn" onClick={() => navigate("/dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
}

export default ViewAnswers;