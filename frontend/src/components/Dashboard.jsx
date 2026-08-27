import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function Dashboard({ search, setSearch }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =====================================
  // LOAD NOTES
  // =====================================

  const loadNotes = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notes"
      );

      const data = await res.json();

      if (res.ok) {
        setNotes(data);
      } else {
        console.log(data);
      }

    } catch (error) {
      console.error("Notes error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadNotes();
  }, []);


  // =====================================
  // LIKE NOTE
  // =====================================

  const handleLike = async (noteId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notes/${noteId}/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.name,
          }),
        }
      );

      const updatedNote = await res.json();

      if (res.ok) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === updatedNote._id
              ? updatedNote
              : note
          )
        );
      }

    } catch (error) {
      console.error(error);
    }
  };


  // =====================================
  // SEARCH
  // =====================================

  const filteredNotes = notes.filter((note) => {
    const text = search?.toLowerCase() || "";

    return (
      note.title?.toLowerCase().includes(text) ||
      note.topic?.toLowerCase().includes(text) ||
      note.uploadedBy?.toLowerCase().includes(text)
    );
  });


  return (
    <Layout
      search={search}
      setSearch={setSearch}
    >

      <div className="notes-feed">

        {/* ================= HEADER ================= */}

        <div className="feed-header">

          <div>
            <h2>📚 Notes Feed</h2>

            <p>
              Learn and share with your campus
              community.
            </p>
          </div>

          <button
            className="new-post"
            onClick={() => navigate("/upload")}
          >
            + Post Note
          </button>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="card">
            <p>Loading notes...</p>
          </div>
        )}


        {/* ================= EMPTY ================= */}

        {!loading &&
          filteredNotes.length === 0 && (

            <div
              className="card"
              style={{
                textAlign: "center",
                padding: "50px",
              }}
            >

              <div
                style={{
                  fontSize: "50px",
                }}
              >
                📚
              </div>

              <h3>
                No notes yet
              </h3>

              <p
                style={{
                  color: "#888",
                }}
              >
                Be the first person to share
                study notes!
              </p>

              <button
                className="btn"
                onClick={() =>
                  navigate("/upload")
                }
              >
                + Post Note
              </button>

            </div>
          )}


        {/* ================= NOTE POSTS ================= */}

        {!loading &&
          filteredNotes.map((note) => {

            const liked =
              note.likes?.includes(user?.name);

            return (

              <div
                className="note-feed-card"
                key={note._id}
              >

                {/* USER */}

                <div className="note-post-user">

                  <div className="avatar">
                    {note.uploadedBy
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div>

                    <strong>
                      {note.uploadedBy}
                    </strong>

                    <span>
                      {note.uploadedByRole ||
                        "Student"}
                    </span>

                  </div>

                </div>


                {/* NOTE */}

                <div className="note-post-content">

                  <div className="note-topic">
                    {note.topic}
                  </div>

                  <h3>
                    📄 {note.title}
                  </h3>

                  <p>
                    Study material shared
                    with Campus Connect.
                  </p>

                </div>


                {/* FILE */}

                <div className="note-file-preview">

                  <div>

                    <span className="file-icon">
                      📄
                    </span>

                    <div>

                      <strong>
                        Study Material
                      </strong>

                      <small>
                        {note.file}
                      </small>

                    </div>

                  </div>

                  <a
                    href={`http://localhost:5000/uploads/${note.file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="download-note-link"
                  >
                    Open
                  </a>

                </div>


                {/* ACTIONS */}

                <div className="note-actions">

                  <button
                    className={
                      liked
                        ? "liked-btn"
                        : "like-btn"
                    }
                    onClick={() =>
                      handleLike(note._id)
                    }
                  >
                    {liked ? "❤️" : "🤍"}

                    {" "}

                    {note.likes?.length || 0}
                  </button>


                  <button
                    className="comment-btn"
                    onClick={() =>
                      navigate(
                        `/notes/${note._id}`
                      )
                    }
                  >
                    💬 Comments
                  </button>


                  <button
                    className="view-note-feed-btn"
                    onClick={() =>
                      navigate(
                        `/notes/${note._id}`
                      )
                    }
                  >
                    View Note →
                  </button>

                </div>

              </div>
            );
          })}

      </div>

    </Layout>
  );
}

export default Dashboard;