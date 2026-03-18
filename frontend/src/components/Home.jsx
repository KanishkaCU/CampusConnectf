import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="page-center">
      <div className="card">
        <h1>Campus Connect</h1>

        <p style={{ textAlign: "center" }}>
          Senior–Junior Interaction Platform
        </p>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link className="btn" to="/login">
            Login
          </Link>

          <br /><br />

          <Link className="link" to="/register">
            New user? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;