import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UploadNotes() {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Protect route (only logged-in users)
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    // ❗ Only Senior can upload
    if (user && user.role !== "Senior") {
      alert("Only seniors can upload notes");
      navigate("/dashboard");
    }
  }, [navigate, user]);

  // ✅ Handle Upload
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

        // Clear fields
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
    <div className="page-center">
      <div className="card">
        <h2>Upload Notes</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Topic */}
        <input
          type="text"
          placeholder="Topic (Java, DBMS...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* File */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Buttons */}
        <div style={{ marginTop: "10px" }}>
          <button className="btn" onClick={handleUpload}>
            Upload
          </button>

          <button
            className="btn"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadNotes;