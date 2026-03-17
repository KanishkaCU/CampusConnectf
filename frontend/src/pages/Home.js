import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  // ✅ Check if user already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/dashboard"); // redirect if logged in
    }
  }, [navigate]);

  return (
    <div className="page-center">
      <div className="card">
        <h1>Campus Connect</h1>

        <p style={{ textAlign: "center" }}>
          Senior–Junior Interaction Platform
        </p>

        <Link className="btn" to="/login">
          Login
        </Link>

        <Link className="link" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;