import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewAnswers() {
  const { id } = useParams(); // ✅ get question id
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ fetch question
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((q) => q._id === id);
        setQuestion(found);
      });
  }, [id]);

  // ✅ submit answer
  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Enter answer");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/answer/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer,
            answeredBy: user?.name,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setQuestion(data); // update UI
        setAnswer("");
       
      } else {
        alert("Failed to submit");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{question.title}</h2>
      <p>{question.description}</p>

      <h3>Answer:</h3>
      <p>{question.answer || "No answer yet"}</p>

      {/* ✅ only senior can answer */}
      {user?.role === "Senior" && (
        <>
          <textarea
            placeholder="Write answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ width: "100%", height: "80px" }}
          />

          <br /><br />

          <button onClick={handleSubmit}>
            Submit Answer
          </button>
        </>
      )}

      <br /><br />

      <button onClick={() => navigate("/dashboard")}>
        Back
      </button>
    </div>
  );
}

export default ViewAnswers;