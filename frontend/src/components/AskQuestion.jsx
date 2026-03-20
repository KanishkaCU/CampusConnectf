import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function AskQuestion({ search, setSearch }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handlePost = async () => {
    if (!title || !description || !category) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("postedBy", user?.name);
    formData.append("role", user?.role);

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Question posted successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to post");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <Layout search={search} setSearch={setSearch}>
      <div className="page-center">
        <div className="card">
          <h2>Ask Question</h2>

          {/* CATEGORY */}
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="notes">Notes</option>
            <option value="projects">Projects</option>
            <option value="guidance">Guidance</option>
            <option value="career">Career</option>
            <option value="skills">Skills</option>
          </select>

          {/* TITLE */}
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* FILE */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn" onClick={handlePost}>
            Post Question
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default AskQuestion;