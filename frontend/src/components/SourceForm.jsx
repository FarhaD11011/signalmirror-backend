
function SourceForm({
    sourceTitle,
    setSourceTitle,
    sourceUrl,
    setSourceUrl,
    sourceSummary,
    setSourceSummary,
    sourceImageUrl,
    setSourceImageUrl,
    sourceVideoUrl,
    setSourceVideoUrl,
    sourcePlatform,
    setSourcePlatform,
    sourceCategoryId,
    setSourceCategoryId,
    categories,
    handleSubmitSource,
    isSubmittingSource,
}) {
  return (
    <div
      style={{
            background: "#fff",
            padding: "20px",
            margin: "20px ", // ✅ center horizontally
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            maxWidth: "500px", // ✅ control width
            width: "100%",
        }}
    >
      <h2>(Submit a Source)</h2>

      <form onSubmit={handleSubmitSource}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Title"
            value={sourceTitle}
            onChange={(e) => setSourceTitle(e.target.value)}
            disabled={isSubmittingSource}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="URL"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            disabled={isSubmittingSource}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="Summary"
            value={sourceSummary}
            onChange={(e) => setSourceSummary(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={sourceImageUrl}
            onChange={(e) => setSourceImageUrl(e.target.value)}
            disabled={isSubmittingSource}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Video URL (YouTube, etc)"
            value={sourceVideoUrl}
            onChange={(e) => setSourceVideoUrl(e.target.value)}
            disabled={isSubmittingSource}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Platform (optional)"
            value={sourcePlatform}
            onChange={(e) => setSourcePlatform(e.target.value)}
            disabled={isSubmittingSource}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <select
            value={sourceCategoryId}
            onChange={(e) => setSourceCategoryId(e.target.value)}
            disabled={isSubmittingSource}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

              <button
              type="submit"
              disabled={isSubmittingSource}
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "6px",
                cursor: isSubmittingSource ? "not-allowed" : "pointer",
                background: isSubmittingSource ? "#6c757d" : "#007bff",
                color: "white",
                width: "100%",
                fontWeight: "bold",
              }}
              >
              {isSubmittingSource ? "Submitting..." : "Submit Source"}
          </button>
      </form>
    </div>
  );
}

export default SourceForm;