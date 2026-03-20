import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";

function ViewAnswers({ search, setSearch }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((q) => q._id === id);
        setQuestion(found);
      });
  }, [id]);

  // ❤️ LIKE HANDLER
  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/questions/like/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user?.name }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuestion(data); // update like count in UI instantly
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Enter answer");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/answer/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, answeredBy: user?.name }),
      });

      const data = await res.json();

      if (res.ok) {
        setQuestion(data);
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

  // check if current user already liked
  const hasLiked = question.likes?.includes(user?.name);

  return (
    <Layout search={search} setSearch={setSearch}>
      <div className="card" style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* QUESTION */}
        <div className="post-top">
          <div className="user">
            <div className="avatar small">
              {question.postedBy?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <b>{question.postedBy}</b>
              <p style={{ margin: 0, fontSize: "12px" }}>{question.role}</p>
            </div>
          </div>
          <span className="tag">{question.category}</span>
        </div>

        <h2 style={{ marginTop: "12px" }}>{question.title}</h2>
        <p style={{ color: "#555" }}>{question.description}</p>

        {/* ❤️ LIKE BUTTON */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
          <button
            onClick={handleLike}
            style={{
              background: hasLiked ? "#fee2e2" : "#f9fafb",
              border: `1.5px solid ${hasLiked ? "#ef4444" : "#e5e7eb"}`,
              borderRadius: "8px",
              padding: "8px 18px",
              cursor: "pointer",
              fontSize: "16px",
              color: hasLiked ? "#ef4444" : "#555",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            {hasLiked ? "❤️" : "🤍"} {question.likes?.length || 0} {hasLiked ? "Liked" : "Like"}
          </button>
        </div>

        <hr style={{ margin: "16px 0" }} />

        {/* ANSWER */}
        <h3>Answer</h3>
        {question.answer ? (
          <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "8px" }}>
            <p>{question.answer}</p>
            <small style={{ color: "#888" }}>— {question.answeredBy}</small>
          </div>
        ) : (
          <p style={{ color: "#aaa" }}>No answer yet</p>
        )}

        {/* ANSWER INPUT - only seniors */}
        {user?.role === "Senior" && (
          <>
            <hr style={{ margin: "16px 0" }} />
            <h4>Write Your Answer</h4>
            <textarea
              placeholder="Write answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ width: "100%", height: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
            <br /><br />
            <button className="btn" onClick={handleSubmit}>
              Submit Answer
            </button>
          </>
        )}

        <br /><br />

        <button
          onClick={() => navigate("/dashboard")}
          style={{ background: "none", border: "1px solid #ccc", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
        >
          ← Back
        </button>

      </div>
    </Layout>
  );
}

export default ViewAnswers;