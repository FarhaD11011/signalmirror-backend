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
          fontWeight: "500",
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
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        {navButton("Feed", "feed")}
        {user && navButton("SUBMIT SOURCE", "submit")}
        {user && navButton("Bookmarks", "bookmarks")}
        {user?.role === "admin" && navButton("Pending", "pending")}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {user && (
          <div
            style={{
              fontSize: "14px",
              color: "#444",
              fontWeight: "500",
            }}
          >
            Signed in as{" "}
            <strong>
              {user.username?.charAt(0).toUpperCase() + user.username?.slice(1)}
            </strong>
            {user.role === "admin" && (
              <span
                style={{
                  marginLeft: "8px",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  background: "#111",
                  color: "white",
                  fontSize: "12px",
                }}
              >
                Admin
              </span>
            )}
          </div>
        )}

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
    </div>
  );
}

export default NavBar;