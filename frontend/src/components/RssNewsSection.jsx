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
        rssSources.map((section, idx) => (
  <div key={idx} style={{ marginBottom: "20px" }}>
    <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "4px" }}>
      {section.title}
    </h3>

    {section.items.map((item, index) => (

           <div
              key={`${item.url}-${index}`}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    display: "block",
                  }}
                />
              )}
              <strong>{item.title}</strong>
              <p style={{ margin: "6px 0" }}>{item.summary}</p>
              <div style={{ fontSize: "13px", color: "#666" }}>
                {item.source_name}
              </div>
              <a href={item.url} target="_blank" rel="noreferrer">
                Visit Source
              </a>
            </div>

            ))}
        </div>
        ))
            )}
    </div>
  );
}

export default RssNewsSection;