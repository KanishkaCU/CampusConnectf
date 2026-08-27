import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function MyNotes({ search, setSearch }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => {
        // Show only notes uploaded by current user
        const myNotes = data.filter(
          (note) => note.uploadedBy === user.name
        );

        setNotes(myNotes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Search
  const filtered = notes.filter((note) => {
    const s = search?.toLowerCase() || "";

    return (
      note.title?.toLowerCase().includes(s) ||
      note.topic?.toLowerCase().includes(s)
    );
  });

  return (
    <Layout
      search={search}
      setSearch={setSearch}
    >
      <div className="notes-page">

        {/* ================= HEADER ================= */}

        <div className="header">

          <div>
            <h2>📚 My Notes</h2>

            <p>
              Notes shared by you with the campus
            </p>
          </div>

          <button
            className="new-post"
            onClick={() => navigate("/upload")}
          >
            + Upload Note
          </button>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="card">
            <p>Loading your notes...</p>
          </div>
        )}


        {/* ================= EMPTY ================= */}

        {!loading && filtered.length === 0 && (

          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "50px 30px",
            }}
          >

            <div style={{ fontSize: "50px" }}>
              📚
            </div>

            <h3>
              You haven't uploaded any notes yet
            </h3>

            <p style={{ color: "#888" }}>
              Share your study materials with
              other Campus Connect students.
            </p>

            <button
              className="btn"
              style={{
                maxWidth: "200px",
              }}
              onClick={() => navigate("/upload")}
            >
              + Upload Note
            </button>

          </div>
        )}


        {/* ================= NOTES ================= */}

        {!loading &&
          filtered.map((note) => (

            <div
              key={note._id}
              className="post note-list-card"
            >

              {/* TOP */}

              <div className="post-top">

                <div className="user">

                  <div className="avatar small">
                    {note.uploadedBy?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div>

                    <b>
                      {note.uploadedBy}
                    </b>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                      }}
                    >
                      {user?.role}
                    </p>

                  </div>

                </div>

                <span className="tag">
                  {note.topic}
                </span>

              </div>


              {/* TITLE */}

              <h3>
                📄 {note.title}
              </h3>


              {/* FILE INFO */}

              <p
                style={{
                  color: "#7b877f",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                📎 {note.file}
              </p>


              {/* ACTIONS */}

              <div className="post-bottom">

                <button
                  className="view-note-btn"
                  onClick={() =>
                    navigate(`/notes/${note._id}`)
                  }
                >
                  📄 View Note →
                </button>

                <a
                  href={`http://localhost:5000/uploads/${note.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="download-note-link"
                >
                  📥 Download
                </a>

              </div>

            </div>

          ))}

      </div>
    </Layout>
  );
}

export default MyNotes;