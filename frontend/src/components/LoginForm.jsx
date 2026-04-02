function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
}) {
  return (
    <form
      onSubmit={handleLogin}
      style={{
        marginBottom: "20px",
        background: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <button type="submit" style={{ padding: "8px 12px" }}>
        Login
      </button>
    </form>
  );
}

export default LoginForm;