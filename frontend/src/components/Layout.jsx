import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Layout({ children, search, setSearch }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div
          className="brand"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >

          <div className="logo">
            C
          </div>

          <div>
            <h3>Campus Connect</h3>
            <span>Student Learning Hub</span>
          </div>

        </div>


        {/* SEARCH */}

        <div className="search-container">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search notes..."
            value={search || ""}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* USER */}

        <div className="navbar-user">

          <div className="avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="navbar-user-info">

            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.role || "Student"}
            </span>

          </div>

          <button
            className="logout-icon"
            onClick={handleLogout}
            title="Logout"
          >
            ↪
          </button>

        </div>

      </header>


      {/* ================= BODY ================= */}

      <div className="app-body">


        {/* ================= SIDEBAR ================= */}

        <aside className="filter-sidebar">

          <div className="filter-card">

            <h3>
              📚 Campus Connect
            </h3>

            <p
              style={{
                color: "#7b877f",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Share notes, learn together
              and help each other.
            </p>


            {/* POST NOTE */}

            <button
              className="sidebar-post-btn"
              onClick={() => navigate("/upload")}
            >
              + Post Note
            </button>

          </div>


          {/* NAVIGATION */}

          <div className="sidebar-navigation">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className={
                location.pathname === "/dashboard"
                  ? "active"
                  : ""
              }
            >
              🏠 Notes Feed
            </button>


            <button
              onClick={() =>
                navigate("/notes")
              }
              className={
                location.pathname === "/notes"
                  ? "active"
                  : ""
              }
            >
              📚 My Notes
            </button>


            <button
              onClick={() =>
                navigate("/profile")
              }
              className={
                location.pathname === "/profile"
                  ? "active"
                  : ""
              }
            >
              👤 Profile
            </button>

          </div>


          {/* LOGOUT */}

          <div className="sidebar-bottom">

            <button
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>

        </aside>


        {/* ================= MAIN ================= */}

        <main className="main-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;