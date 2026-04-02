
function SourceForm({
    sourceTitle,
    setSourceTitle,
    sourceUrl,
    setSourceUrl,
    sourceSummary,
    setSourceSummary,
    sourceImageUrl,
    setSourceImageUrl,
    sourcePlatform,
    setSourcePlatform,
    sourceCategoryId,
    setSourceCategoryId,
    categories,
    handleSubmitSource,
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
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="URL"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
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
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Platform (optional)"
            value={sourcePlatform}
            onChange={(e) => setSourcePlatform(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <select
            value={sourceCategoryId}
            onChange={(e) => setSourceCategoryId(e.target.value)}
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
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#007bff",
            color: "white",
          }}
        >
          Submit Source
        </button>
      </form>
    </div>
  );
}

export default SourceForm;