function SourceList({ sources, isBookmarked, handleBookmark }) {
  if (sources.length === 0) {
    return <p>No sources found.</p>;
  }

  return (
    <>
      {sources.map((source) => {
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

            <div style={{ marginTop: "14px" }}>
              👍 {source.upvotes} | 👎 {source.downvotes} | Score:{" "}
              {source.score}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default SourceList;