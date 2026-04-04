function SortBar({ sortBy, setSortBy }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ marginRight: "10px" }}>Sort By:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{ padding: "8px", borderRadius: "6px" }}
      >
        <option value="newest">Newest</option>
        <option value="score">Highest Score</option>
        <option value="upvotes">Most Upvotes</option>
      </select>
    </div>
  );
}

export default SortBar;