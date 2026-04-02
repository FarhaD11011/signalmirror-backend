function MessageBanner({ type, message }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: isSuccess ? "#d4edda" : "#f8d7da",
        color: isSuccess ? "#155724" : "#721c24",
        padding: "12px 16px",
        borderRadius: "8px",
        border: isSuccess ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: "420px",
        width: "calc(100% - 32px)",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

export default MessageBanner;