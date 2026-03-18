import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="left">
          <div className="logo">C</div>
          <div>
            <h3>Campus Connect</h3>
            <span>Student Learning Hub</span>
          </div>
        </div>

        <div className="right">
          <div className="profile">
            <div className="avatar">{user?.name?.[0]}</div>
            <div>
              <p>{user?.name}</p>
              <span>{user?.role}</span>
            </div>
          </div>

          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="content">

        {/* SIDEBAR */}
        <div className="sidebar">
          <h4>Filters</h4>

          <button className="active">Recent</button>
          <button>Popular</button>

          <h5>Category</h5>

          <button className="active">All Posts</button>
          <button>Study Notes</button>
          <button>Projects</button>
          <button>Guidance</button>
          <button>Career</button>
          <button>Skills</button>
        </div>

        {/* MAIN */}
        <div className="main">

          <div className="header">
            <div>
              <h2>All Posts</h2>
              <p>{questions.length} posts available</p>
            </div>

            <Link to="/ask" className="new-post">
              + New Post
            </Link>
          </div>

          {questions.map((q) => (
            <div key={q._id} className="post">

              <div className="post-top">
                <div className="user">
                  <div className="avatar small">
                    {user?.name?.[0]}
                  </div>
                  <div>
                    <b>{user?.name}</b>
                    <span>{user?.role}</span>
                  </div>
                </div>

                <span className="tag">notes</span>
              </div>

              <h3>{q.title}</h3>
              <p>{q.description}</p>

              <div className="post-bottom">
                <span>❤️ 0</span>
                <span>💬 {q.answer ? 1 : 0}</span>

                <Link to={`/answers/${q._id}`} className="view-btn">
                  View →
                </Link>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;