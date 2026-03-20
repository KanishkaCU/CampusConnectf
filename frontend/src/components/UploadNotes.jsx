import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function UploadNotes({ search, setSearch }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.role !== "Senior") {
      alert("Only seniors can upload notes");
      navigate("/dashboard");
    }
  }, [navigate, user]);

  const handleUpload = async () => {
    if (!title || !topic || !file) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("topic", topic);
    formData.append("file", file);
    formData.append("uploadedBy", user.name);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("File uploaded successfully!");
        setTitle("");
        setTopic("");
        setFile(null);
        navigate("/dashboard");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <Layout search={search} setSearch={setSearch}>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div className="card">
          <h2>📤 Upload Notes</h2>
          <p style={{ color: "#888", marginBottom: "16px" }}>
            Share your notes with juniors
          </p>

          {/* Title */}
          <input
            type="text"
            placeholder="Title (e.g. DBMS Unit 1)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Topic */}
          <input
            type="text"
            placeholder="Topic (e.g. Java, DBMS...)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          {/* File */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button className="btn" onClick={handleUpload}>
              📤 Upload
            </button>
            <button
              className="btn"
              style={{ background: "#6b7280" }}
              onClick={() => navigate("/dashboard")}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UploadNotes;