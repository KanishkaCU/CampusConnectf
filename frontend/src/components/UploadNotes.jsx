import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function UploadNotes({ search, setSearch }) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleUpload = async () => {
    if (!title.trim() || !topic.trim() || !file) {
      alert("Please fill all fields and select a file");
      return;
    }

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
formData.append("title", title);
formData.append("topic", topic);
formData.append("file", file);
formData.append("uploadedBy", user.name);
formData.append("uploadedByRole", user.role);

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/api/notes", {
  method: "POST",
  body: formData,
});
      const data = await res.json();

      if (res.ok) {
        alert("Note uploaded successfully! 📚");

        setTitle("");
        setTopic("");
        setFile(null);

        navigate("/notes");
      } else {
        alert(data.message || "Upload failed");
      }

    } catch (error) {
      console.error(error);
      alert("Cannot connect to server");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout
      search={search}
      setSearch={setSearch}
    >

      <div className="create-post-page">

        {/* HEADER */}

        <div className="create-post-header">

          <div>
            <h2>📚 Share Study Notes</h2>

            <p>
              Share useful notes and learning materials
              with your campus community.
            </p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/notes")}
          >
            ← Back
          </button>

        </div>


        {/* CARD */}

        <div className="create-post-card">

          {/* TITLE */}

          <div className="form-group">

            <label>
              Note Title <span>*</span>
            </label>

            <input
              type="text"
              placeholder="Example: DBMS Unit 1 Notes"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>


          {/* TOPIC */}

          <div className="form-group">

            <label>
              Subject / Topic <span>*</span>
            </label>

            <input
              type="text"
              placeholder="Example: DBMS, Python, AI..."
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
            />

          </div>


          {/* FILE */}

          <div className="form-group">

            <label>
              Study Material <span>*</span>
            </label>

            <div className="file-upload">

              <input
                type="file"
                id="note-file"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />

              <label htmlFor="note-file">
                📎 Choose File
              </label>

              <span>
                {file
                  ? file.name
                  : "PDF, PPT, DOC, TXT, etc."}
              </span>

            </div>

          </div>


          {/* UPLOADER */}

          <div className="post-author">

            <div className="avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role || "Student"}
              </span>
            </div>

          </div>


          {/* ACTIONS */}

          <div className="form-actions">

            <button
              className="cancel-btn"
              onClick={() => navigate("/notes")}
            >
              Cancel
            </button>

            <button
              className="post-submit-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "📚 Publish Note"}
            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default UploadNotes;