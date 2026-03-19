import { useNavigate } from "react-router-dom";

function Layout({ children, filter, setFilter, category, setCategory }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout">

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

          <button
            className={filter === "recent" ? "active" : ""}
            onClick={() => setFilter("recent")}
          >
            Recent
          </button>

          <button
            className={filter === "popular" ? "active" : ""}
            onClick={() => setFilter("popular")}
          >
            Popular
          </button>

          <h5>Category</h5>

          {["all", "notes", "projects", "guidance", "career", "skills"].map(
            (cat) => (
              <button
                key={cat}
                className={category === cat ? "active" : ""}
                onClick={() => setCategory(cat)}
              >
                {cat === "all" ? "All Posts" : cat}
              </button>
            )
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;