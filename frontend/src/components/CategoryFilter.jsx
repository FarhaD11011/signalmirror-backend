function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  categories,
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ marginRight: "10px" }}>Select Category:</label>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: "8px" }}
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