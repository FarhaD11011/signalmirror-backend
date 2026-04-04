function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ marginRight: "10px" }}>Search:</label>
      <input
        type="text"
        placeholder="Search sources by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          width: "250px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}

export default SearchBar;