function MessageBanner({ type, message }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      style={{
        background: isSuccess ? "#d4edda" : "#f8d7da",
        color: isSuccess ? "#155724" : "#721c24",
        padding: "10px 12px",
        borderRadius: "6px",
        // CHANGED: Removed "auto" from the left margin
        margin: "0 0 16px 0", 
        border: isSuccess ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
        maxWidth: "500px",
        width: "100%",
        // CHANGED: Aligns the text inside the box to the left
        textAlign: "left", 
      }}
    >
      {message}
    </div>
  );
}

export default MessageBanner;