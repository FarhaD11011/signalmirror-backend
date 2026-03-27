import { useEffect, useState } from "react";

function App() {
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("http://localhost:5001/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    }

    fetchCategories();
  }, []);

  // fetch sources (with category filter)
  useEffect(() => {
    async function fetchSources() {
      setLoading(true);

      let url = "http://localhost:5001/api/sources";

      if (selectedCategory) {
        url += `?category_id=${selectedCategory}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setSources(data.sources || []);
      setLoading(false);
    }

    fetchSources();
  }, [selectedCategory]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>RelayFlow</h1>

      {/* Category Filter */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Category: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
            }}
          >
            <h2>{source.title}</h2>
            <p>{source.summary}</p>

            <a href={source.url} target="_blank" rel="noreferrer">
              Visit Source
            </a>

            <div>
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