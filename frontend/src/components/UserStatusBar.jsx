function UserStatusBar({ user, handleLogout }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      Logged in as{" "}
      <strong>
        {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
      </strong>
      <button
        onClick={handleLogout}
        style={{ marginLeft: "12px", padding: "8px 12px" }}
      >
        Logout
      </button>
    </div>
  );
}

export default UserStatusBar;