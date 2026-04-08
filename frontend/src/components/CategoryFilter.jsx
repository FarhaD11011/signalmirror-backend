function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  categories,
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <label style={{ fontWeight: "600" }}>Category</label>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;