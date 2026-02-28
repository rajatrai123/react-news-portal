import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const POSTS_PER_PAGE = 10;

export default function App() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Search + Sort
  const processedPosts = useMemo(() => {
    let filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [posts, searchTerm, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedPosts.length / POSTS_PER_PAGE);

  const indexOfLast = currentPage * POSTS_PER_PAGE;
  const indexOfFirst = indexOfLast - POSTS_PER_PAGE;
  const currentPosts = processedPosts.slice(indexOfFirst, indexOfLast);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  return (
    <div className="page">
      <header className="header">
        <h1 className="logo">React Posts</h1>
      </header>

      <div className="container">
        <div className="controls">
          <input
            className="search"
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="asc">Title A-Z</option>
            <option value="desc">Title Z-A</option>
          </select>
        </div>

        <p className="info">
          Showing {currentPosts.length} posts per page | Total:{" "}
          {processedPosts.length}
        </p>

        {loading && <p>Loading news...</p>}
        {error && <p className="error">{error}</p>}

        {!loading &&
          !error &&
          currentPosts.map((post) => (
            <div key={post.id} className="card">
              <h2 className="title">{post.title}</h2>
              <p className="body">{post.body}</p>
              <span className="readMore">Read more →</span>
            </div>
          ))}

        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pageBtn"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => changePage(i + 1)}
              className={`pageBtn ${
                currentPage === i + 1 ? "active" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pageBtn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}