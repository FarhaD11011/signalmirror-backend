import { useEffect, useState } from "react";

function App() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSources() {
      try {
        const response = await fetch("http://localhost:5001/api/sources");
        const data = await response.json();

        if (!response.ok) {
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
  }, []);

  if (loading) {
    return <h2>Loading sources...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>RelayFlow</h1>
      <p>Approved public feed</p>

      {sources.length === 0 ? (
        <p>No approved sources found.</p>
      ) : (
        <div>
          {sources.map((source) => (
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
                <strong>Votes:</strong> 👍 {source.upvotes} | 👎 {source.downvotes} | Score: {source.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;