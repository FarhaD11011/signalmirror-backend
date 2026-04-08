function FeedModeBar({ feedMode, setFeedMode }) {
  function modeButton(label, value) {
    const isActive = feedMode === value;

    return (
      <button
        type="button"
        onClick={() => setFeedMode(value)}
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          background: isActive ? "#007bff" : "#e9ecef",
          color: isActive ? "white" : "#333",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      {modeButton("All Feeds", "all")}
      {modeButton("General Feed", "general")}
      {modeButton("External News", "external")}
      
    </div>
  );
}

export default FeedModeBar;