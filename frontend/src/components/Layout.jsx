import React from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children, filter, setFilter, category, setCategory, search, setSearch }) {
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

        {/* 🔍 SEARCH */}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts & notes..."
            className="search"
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn" onClick={() => { }}>
            🔍 Search
          </button>
        </div>

        {/* RIGHT - Profile & Logout */}
        <div className="right">
          <div className="profile">
            <div className="avatar">{user?.name?.[0]}</div>
            <div>
              <p>{user?.name}</p>
              <span>{user?.role}</span>
            </div>
          </div>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>

      </div> {/* ✅ closes navbar */}

      {/* BODY */}
      <div className="content">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div>
            <h4>Menu</h4>
            <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
            <button onClick={() => navigate("/profile")}>👤 Profile</button>
            <button onClick={() => navigate("/notes")}>📄 My Notes</button>
          </div>
          <div>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {children}
        </div>

      </div> {/* ✅ closes content */}

    </div> // ✅ closes layout
  );
}

export default Layout;