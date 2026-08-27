import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function AskQuestion({ search, setSearch }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handlePost = async () => {
    if (!title.trim() || !description.trim() || !category) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("postedBy", user?.name || "");
    formData.append("role", user?.role || "");

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/questions",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Post created successfully! 🎉");

        setTitle("");
        setDescription("");
        setCategory("");
        setFile(null);

        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to create post");
      }

    } catch (err) {
      console.error(err);
      alert("Unable to connect to server");
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
            <h2>Create a Post</h2>

            <p>
              Ask a question, share your knowledge,
              or start a discussion with your campus.
            </p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>

        </div>


        {/* FORM */}

        <div className="create-post-card">

          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category <span>*</span>
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="">
                Select a category
              </option>

              <option value="notes">
                📚 Study Notes
              </option>

              <option value="projects">
                💻 Projects
              </option>

              <option value="guidance">
                🎓 Guidance
              </option>

              <option value="career">
                💼 Career
              </option>

              <option value="skills">
                🛠 Skills
              </option>
            </select>

          </div>


          {/* TITLE */}

          <div className="form-group">

            <label>
              Title <span>*</span>
            </label>

            <input
              type="text"
              placeholder="What would you like to ask?"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description <span>*</span>
            </label>

            <textarea
              placeholder="Explain your question or discussion..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>


          {/* FILE */}

          <div className="form-group">

            <label>
              Attachment
              <small> Optional</small>
            </label>

            <div className="file-upload">

              <input
                type="file"
                id="post-file"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />

              <label htmlFor="post-file">
                📎 Choose a file
              </label>

              <span>
                {file
                  ? file.name
                  : "No file selected"}
              </span>

            </div>

          </div>


          {/* USER INFO */}

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
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button
              className="post-submit-btn"
              onClick={handlePost}
            >
              🚀 Publish Post
            </button>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default AskQuestion;