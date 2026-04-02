function PendingSourcesPanel({
  pendingSources,
  handleApproveSource,
  handleRejectSource,
}) {
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

            <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
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

              <button
                onClick={() => handleRejectSource(source.id)}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#dc3545",
                  color: "white",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PendingSourcesPanel;