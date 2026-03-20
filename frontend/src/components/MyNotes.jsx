import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

function MyNotes({ search, setSearch }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => {
        // only show notes uploaded by this user
        const myNotes = data.filter((n) => n.uploadedBy === user?.name);
        setNotes(myNotes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // filter by search
  const filtered = notes.filter((n) => {
    const s = search?.toLowerCase() || "";
    return (
      n.title?.toLowerCase().includes(s) ||
      n.topic?.toLowerCase().includes(s)
    );
  });

  return (
    <Layout search={search} setSearch={setSearch}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* HEADER */}
        <div className="header">
          <div>
            <h2>My Notes</h2>
            <p>{filtered.length} notes uploaded</p>
          </div>
          <button className="new-post" onClick={() => navigate("/upload")}>
            + Upload Note
          </button>
        </div>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "48px" }}>📄</p>
            <h3>No notes yet</h3>
            <p style={{ color: "#888" }}>Upload your first note to share with juniors!</p>
            <button className="btn" onClick={() => navigate("/upload")}>
              + Upload Note
            </button>
          </div>
        )}

        {/* NOTES LIST */}
        {filtered.map((note) => (
          <div key={note._id} className="post">

            {/* TOP */}
            <div className="post-top">
              <div className="user">
                <div className="avatar small">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <b>{note.uploadedBy}</b>
                  <p style={{ margin: 0, fontSize: "12px" }}>{user?.role}</p>
                </div>
              </div>
              <span className="tag">{note.topic}</span>
            </div>

            {/* TITLE */}
            <h3>{note.title}</h3>

            {/* BOTTOM */}
            <div className="post-bottom">
              
                <a href={`http://localhost:5000/uploads/${note.file}`}
                target="_blank"
                rel="noreferrer"
                className="view-btn"
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