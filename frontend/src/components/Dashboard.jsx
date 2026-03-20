import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

function Dashboard({ search, setSearch }) {  // ✅ accept setSearch
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("recent");
  const [category, setCategory] = useState("all");

  // ✅ FETCH QUESTIONS
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ FILTER + SEARCH + SORT
const filtered = questions
  .filter((q) => {
    const searchText = search?.toLowerCase() || "";

    const matchesSearch =
      q.title?.toLowerCase().includes(searchText) ||
      q.description?.toLowerCase().includes(searchText) ||
      q.category?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "all" ? true : q.category === category;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    if (filter === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (filter === "popular") {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

   return (
    <Layout
      filter={filter}
      setFilter={setFilter}
      category={category}
      setCategory={setCategory}
      search={search}
      setSearch={setSearch}  // ✅ pass the real setSearch
    >
      {/* HEADER */}
      <div className="header">
        <div>
          <h2>All Posts</h2>
          <p>{filtered.length} posts available</p>
        </div>
        <Link to="/ask" className="new-post">+ New Post</Link>
      </div>

      {/* POSTS */}
      {filtered.length === 0 ? (
        <p>No posts available</p>
      ) : (
        filtered.map((q) => (
          <div key={q._id} className="post">

            {/* TOP */}
            <div className="post-top">
              <div className="user">
                <div className="avatar small">
                  {q.postedBy?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <b>{q.postedBy}</b> {/* ✅ removed "Unknown" */}
                  <p style={{ margin: 0, fontSize: "12px" }}>
                    {q.role}
                  </p>
                </div>
              </div>

              <span className="tag">{q.category}</span>
            </div>

            {/* TITLE */}
            <h3>{q.title}</h3>

            {/* BOTTOM */}
            <div className="post-bottom">
              <span>❤️ {q.likes?.length || 0}</span>

              <Link to={`/answers/${q._id}`} className="view-btn">
                View →
              </Link>
            </div>

          </div>
        ))
      )}
    </Layout>
  );
}

export default Dashboard;