import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]); // ✅ moved up

  const navigate = useNavigate();

  // ✅ Get user
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Protect route
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  // ✅ Fetch questions
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Fetch notes
  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-full">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>

        <div className="top-right">
          <button onClick={() => navigate("/")}>Home</button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* QUESTIONS */}
      <h3>Questions</h3>

      {questions.length === 0 ? (
        <p style={{ textAlign: "center" }}>No questions yet</p>
      ) : (
        questions.map((q) => (
          <div key={q._id} className="dashboard-question">
            <h4>{q.title}</h4>
            <p>{q.description}</p>

            <div className="dashboard-footer">
              <span className="dashboard-tag">
                Asked by {user?.name || "User"}
              </span>

              <Link to={`/answers/${q._id}`} className="dashboard-btn">
                View Answer
              </Link>
            </div>
          </div>
        ))
      )}

      {/* ASK QUESTION */}
      <Link to="/ask" className="dashboard-ask">
        Ask New Question
      </Link>

      {/* NOTES SECTION */}
      <h3 style={{ marginTop: "30px" }}>Notes</h3>

      {notes.length === 0 ? (
        <p>No notes uploaded</p>
      ) : (
        notes.map((n) => (
          <div key={n._id} className="dashboard-question">
            <h4>{n.title}</h4>
            <p>Uploaded by: {n.uploadedBy}</p>

            <a
              href={`http://localhost:5000/uploads/${n.file}`}
              target="_blank"
              rel="noreferrer"
              className="dashboard-btn"
            >
              View PDF
            </a>
          </div>
        ))
      )}

      {/* UPLOAD NOTES BUTTON (ONLY SENIOR) */}
      {user?.role === "Senior" && (
        <Link to="/upload" className="dashboard-ask">
          Upload Notes
        </Link>
      )}

    </div>
  );
}

export default Dashboard;