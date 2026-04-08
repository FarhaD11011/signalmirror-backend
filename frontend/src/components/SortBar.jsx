function SortBar({ sortBy, setSortBy }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <label style={{ fontWeight: "600" }}>Sort</label>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="newest">Newest</option>
        <option value="score">Score</option>
        <option value="upvotes">Upvotes</option>
      </select>
    </div>
  );
}

export default SortBar;