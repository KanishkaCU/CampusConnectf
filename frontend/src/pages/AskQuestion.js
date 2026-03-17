import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate(); // ✅ added

  const handlePost = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();
      console.log(data);

      alert("Question posted successfully!");

      // ✅ clear fields
      setTitle("");
      setDescription("");

      // ✅ redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Error posting question");
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
        ></textarea>

        <button className="btn" onClick={handlePost}>
          Post Question
        </button>

        <button className="link" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AskQuestion;