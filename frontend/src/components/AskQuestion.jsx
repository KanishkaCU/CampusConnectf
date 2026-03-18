import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handlePost = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Question posted!");
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-center">
      <div className="card">
        <h2>Ask Question</h2>

        <input
          placeholder="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe your question"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn" onClick={handlePost}>
          Post Question
        </button>

        {/* ✅ FIXED HERE */}
        <Link className="link" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AskQuestion;