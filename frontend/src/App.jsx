import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [pendingSources, setPendingSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ✅ fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:5001/api/categories");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Category fetch error:", err.message);
      }
    }
    fetchCategories();
  }, []);


  // ✅ restore login on page refresh
  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  if (savedToken && savedUser) {
    const parsedUser = JSON.parse(savedUser);
    setToken(savedToken);
    setUser(parsedUser);
    fetchBookmarks();
    if (parsedUser.role === "admin") {
    fetchPendingSources();
   }
    }
  }, []);


  // ✅ login handler
  async function handleLogin(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("LOGIN USER:", data.user);
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      fetchBookmarks();
      if (data.user.role === "admin") {
        fetchPendingSources();
      }
      setEmail("");
      setPassword("");
      } catch (err) {
        alert(err.message);ß
      }
    }


  // ✅ logout handler
  function handleLogout() {
    setUser(null);
    setToken(null);
    setBookmarks([]);
    setPendingSources([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }


  // ✅ add bookmark
  async function handleBookmark(sourceId) {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        alert("You must be logged in to bookmark");
        return;
      }
      const res = await fetch("http://localhost:5001/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          source_id: sourceId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Bookmark failed");
      }
      alert(data.message || "Bookmark added successfully");
      fetchBookmarks();
    } catch (err) {
      alert(err.message);
    }
  }


  // ✅ fetch bookmarks
  async function fetchBookmarks() {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setBookmarks([]);
        return;
      }
      const res = await fetch("http://localhost:5001/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bookmarks");
      }
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      console.error("Bookmark fetch error:", err.message);
    }
  }


  async function fetchPendingSources() {
  try {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setPendingSources([]);
      return;
    }
    const res = await fetch("http://localhost:5001/api/admin/sources/pending", {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch pending sources");
    }
    setPendingSources(data.sources || []);
  } catch (err) {
    console.error("Pending sources fetch error:", err.message);
  }
}


  // ✅ remove bookmark
  async function handleRemoveBookmark(sourceId) {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        alert("You must be logged in.");
        return;
      }
      const res = await fetch(
        `http://localhost:5001/api/bookmarks/${sourceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove bookmark");
      }
      alert(data.message || "Bookmark removed successfully");
      fetchBookmarks();
    } catch (err) {
      console.error("Remove bookmark error:", err.message);
      alert(err.message);
    }
  }


  // ✅ helper: check whether a source is already bookmarked
  function isBookmarked(sourceId) {
    if (!Array.isArray(bookmarks)) return false;
    return bookmarks.some((bookmark) => bookmark?.source_id === sourceId);
  }


  // ✅ fetch sources
  useEffect(() => {
    async function fetchSources() {
      try {
        setLoading(true);
        setError("");
        let url = "http://localhost:5001/api/sources";
        if (selectedCategory) {
          url += `?category_id=${selectedCategory}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch sources");
        }
        setSources(data.sources || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, [selectedCategory]);


  async function handleApproveSource(sourceId) {
  try {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      alert("You must be logged in.");
      return;
    }
    const res = await fetch(`http://localhost:5001/api/admin/approve/${sourceId}`, {
          method: "PATCH",
          headers: {
          Authorization: `Bearer ${savedToken}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to approve source");
    }
    alert(data.message || "Source approved successfully");
    fetchPendingSources();
    } catch (err) {
    console.error("Approve source error:", err.message);
    alert(err.message);
    }
    }


  return (
    <div style={{ padding: "20px" }}>
      <h1>RelayFlow</h1>

      {!user ? (
        <form
            onSubmit={handleLogin}
            style={{
              marginBottom: "20px",
              background: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginRight: "10px", padding: "8px" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginRight: "10px", padding: "8px" }}
            />
            <button type="submit" style={{ padding: "8px 12px" }}>
              Login
            </button>
          </form>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          Logged in as{" "}
          <strong>
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          </strong>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "12px", padding: "8px 12px" }}
          >
            Logout
          </button>
        </div>
      )}

      {user && (
        <div
          style={{
            background: "#fff",
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2>My Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p>No bookmarks yet.</p>
          ) : (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.bookmark_id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{bookmark.title}</strong>
                <div style={{ marginTop: "6px" }}>
                  <a href={bookmark.url} target="_blank" rel="noreferrer">
                    Visit Source
                  </a>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.source_id)}
                  style={{
                    marginTop: "8px",
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: "#dc3545",
                    color: "white",
                  }}
                >
                  Remove Bookmark
                </button>
              </div>
            ))
          )}
        </div>
      )}
    
      {user?.role === "admin" && (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
    <h2>Pending Sources</h2>
    {pendingSources.length === 0 ? (
      <p>No pending sources.</p>
    ) : (
      pendingSources.map((source) => (
        <div
          key={source.id}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <strong>{source.title}</strong>
          <p>{source.summary}</p>
          <a href={source.url} target="_blank" rel="noreferrer">
            Visit Source
          </a>
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => handleApproveSource(source.id)}
              style={{
                padding: "8px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                background: "green",
                color: "white",
                  }}
                >
                  Approve
                </button>
              </div>
            </div>
              ))
        )}
      </div>
    )}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error: {error}</h2>
      ) : sources.length === 0 ? (
        <p>No sources found.</p>
      ) : (
        sources.map((source) => {
          const bookmarked = isBookmarked(source.id);
          return (
            <div
              key={source.id}
              style={{
                background: "white",
                padding: "16px",
                marginBottom: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <h2>{source.title}</h2>
              <p>{source.summary}</p>
              <a href={source.url} target="_blank" rel="noreferrer">
                Visit Source
              </a>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleBookmark(source.id)}
                  disabled={bookmarked}
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: bookmarked ? "not-allowed" : "pointer",
                    background: bookmarked ? "#6c757d" : "#007bff",
                    color: "white",
                  }}
                >
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
              <div style={{ marginTop: "10px" }}>
                <strong>Platform:</strong> {source.platform || "Unknown"}
              </div>
              <div style={{ marginTop: "6px" }}>
                👍 {source.upvotes} | 👎 {source.downvotes} | Score:{" "}
                {source.score}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;