function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  handleSignup,
  authMode,
  setAuthMode,
}) {
  return (
    <form
      onSubmit={authMode === "login" ? handleLogin : handleSignup}
      style={{
        marginBottom: "20px",
        background: "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          style={{
            marginRight: "8px",
            padding: "6px 10px",
            background: authMode === "login" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setAuthMode("signup")}
          style={{
            padding: "6px 10px",
            background: authMode === "signup" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Signup
        </button>
      </div>

      <h2 style={{ marginTop: 0 }}>
        {authMode === "login" ? "Login" : "Sign Up"}
      </h2>

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
        {authMode === "login" ? "Login" : "Create Account"}
      </button>
    </form>
  );
}

export default LoginForm;