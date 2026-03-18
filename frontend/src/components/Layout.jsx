import { useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout">

      {/* TOP NAV */}
      <div className="nav">
        <div className="nav-left">
          <div className="logo">C</div>
          <div>
            <h3>Campus Connect</h3>
            <p>Student Learning Hub</p>
          </div>
        </div>

        <div className="nav-right">
          <div className="profile">
            <div className="avatar">{user?.name?.[0]}</div>
            <div>
              <p>{user?.name}</p>
              <span>{user?.role}</span>
            </div>
          </div>

          <button onClick={handleLogout}>⎋</button>
        </div>
      </div>

      {/* BODY */}
      <div className="layout-body">
        {children}
      </div>

    </div>
  );
}

export default Layout;