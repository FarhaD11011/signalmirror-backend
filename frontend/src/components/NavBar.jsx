
function NavBar({ user, activeView, setActiveView, handleLogout }) {
  function navButton(label, view) {
    const isActive = activeView === view;

    return (
      <button
        type="button"
        onClick={() => setActiveView(view)}
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          background: isActive ? "#007bff" : "#e9ecef",
          color: isActive ? "white" : "#333",
          marginRight: "8px",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "12px 16px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div>
        {navButton("Feed", "feed")}

        {user && navButton("Submit Source", "submit")}

        {user && navButton("Bookmarks", "bookmarks")}

        {user?.role === "admin" && navButton("Pending", "pending")}
      </div>

      {user && (
        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#dc3545",
            color: "white",
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default NavBar;