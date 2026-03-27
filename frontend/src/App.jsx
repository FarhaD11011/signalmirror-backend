import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
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

  // ✅ login handler
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      setUser(data.user);
      setToken(data.token);
      // ✅ store token in browser
      localStorage.setItem("token", data.token);
    } catch (err) {
      alert(err.message);
    }
  }

  // ✅ fetch sources (with optional category filter)
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>RelayFlow</h1>

      {/* ✅ login section */}
      {!user ? (
        <form onSubmit={handleLogin} style={{ marginBottom: "20px" }}>
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
          Logged in as <strong>{user.username}</strong>
        </div>
      )}
      {/* ✅ category filter */}
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
      {/* ✅ loading / error / sources */}
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error: {error}</h2>
      ) : sources.length === 0 ? (
        <p>No sources found.</p>
      ) : (
        sources.map((source) => (
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
              <strong>Platform:</strong> {source.platform || "Unknown"}
            </div>
            <div style={{ marginTop: "6px" }}>
              👍 {source.upvotes} | 👎 {source.downvotes} | Score:{" "}
              {source.score}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;