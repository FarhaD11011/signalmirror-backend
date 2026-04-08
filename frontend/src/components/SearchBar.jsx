function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <label style={{ fontWeight: "600" }}>Search</label>

      <input
        type="text"
        placeholder="Search sources..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          width: "380px",
        }}
      />
    </div>
  );
}

export default SearchBar;