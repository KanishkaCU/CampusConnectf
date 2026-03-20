import { useEffect, useState } from "react";
import Layout from "./Layout";

function Profile({ search, setSearch }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [myQuestions, setMyQuestions] = useState([]);
  const [myAnswers, setMyAnswers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => {
        // questions posted by this user
        const asked = data.filter((q) => q.postedBy === user?.name);
        // questions answered by this user
        const answered = data.filter((q) => q.answeredBy === user?.name);

        setMyQuestions(asked);
        setMyAnswers(answered);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout search={search} setSearch={setSearch}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* PROFILE CARD */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div className="avatar" style={{ width: "60px", height: "60px", fontSize: "24px" }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{user?.name}</h2>
              <span className="tag">{user?.role}</span>
            </div>
          </div>

          <p><b>📧 Email:</b> {user?.email}</p>
          <p><b>🎓 Role:</b> {user?.role}</p>
        </div>

        {/* STATS CARD */}
        <div className="card" style={{ marginTop: "16px" }}>
          <h3 style={{ marginBottom: "16px" }}>📊 My Stats</h3>

          <div style={{ display: "flex", gap: "16px", justifyContent: "space-around", textAlign: "center" }}>

            <div style={{ background: "#f0fdf4", padding: "20px 30px", borderRadius: "12px", flex: 1 }}>
              <h1 style={{ margin: 0, color: "#16a34a" }}>{myQuestions.length}</h1>
              <p style={{ margin: 0, color: "#555" }}>Questions Asked</p>
            </div>

            <div style={{ background: "#eff6ff", padding: "20px 30px", borderRadius: "12px", flex: 1 }}>
              <h1 style={{ margin: 0, color: "#2563eb" }}>{myAnswers.length}</h1>
              <p style={{ margin: 0, color: "#555" }}>Answers Given</p>
            </div>

            <div style={{ background: "#fdf4ff", padding: "20px 30px", borderRadius: "12px", flex: 1 }}>
              <h1 style={{ margin: 0, color: "#9333ea" }}>
                {myQuestions.length + myAnswers.length}
              </h1>
              <p style={{ margin: 0, color: "#555" }}>Total Posts</p>
            </div>

          </div>
        </div>

        {/* MY QUESTIONS */}
        {myQuestions.length > 0 && (
          <div className="card" style={{ marginTop: "16px" }}>
            <h3>❓ My Questions</h3>
            {myQuestions.map((q) => (
              <div key={q._id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <b>{q.title}</b>
                <span className="tag" style={{ marginLeft: "10px" }}>{q.category}</span>
              </div>
            ))}
          </div>
        )}

        {/* MY ANSWERS */}
        {myAnswers.length > 0 && (
          <div className="card" style={{ marginTop: "16px" }}>
            <h3>✅ My Answers</h3>
            {myAnswers.map((q) => (
              <div key={q._id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <b>{q.title}</b>
                <p style={{ margin: "4px 0", color: "#555", fontSize: "14px" }}>{q.answer}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Profile;