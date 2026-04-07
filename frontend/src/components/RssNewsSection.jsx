function RssNewsSection({ rssSources, rssLoading, rssError }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h2>External News</h2>
      {rssLoading ? (
        <p>Loading external news...</p>
      ) : rssError ? (
        <p>Error: {rssError}</p>
      ) : rssSources.length === 0 ? (
        <p>No external news found.</p>
      ) : (
        rssSources.map((item, index) => (
          <div
            key={`${item.url}-${index}`}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{item.title}</strong>
            <p style={{ margin: "6px 0" }}>{item.summary}</p>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>
              Source: {item.source_name} | Platform: {item.platform}
            </div>
            <a href={item.url} target="_blank" rel="noreferrer">
              Visit Source
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default RssNewsSection;