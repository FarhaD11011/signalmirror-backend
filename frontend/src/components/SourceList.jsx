
  function SourceList({
  sources,
  isBookmarked,
  handleBookmark,
  handleVote,
  handleShare = () => {},   // ✅ SAFE DEFAULT
  user,
  setActionError,
  setSuccessMessage,
  }) {
  if (sources.length === 0) {
    return <p>No sources found.</p>;
  }

  function requireLoginMessage() {
    setSuccessMessage("");
    setActionError("You need to sign in to use this feature.");
  }

  function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  return null;
  }

  return (
    <>
      {sources.map((source) => {
        const bookmarked = isBookmarked(source.id);
        const isLoggedIn = !!user;
        const embedUrl = getYouTubeEmbedUrl(source.video_url);

        return (
          <div
              key={source.id}
              style={{
                background: "#fff",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                border: "1px solid #eee",
                maxWidth: "720px",
              }}
            >
              {embedUrl && (
                    <iframe
                      src={embedUrl}
                      title={source.title}
                      width="100%"
                      height="220"
                      style={{
                        border: "none",
                        borderRadius: "12px",
                        marginBottom: "16px",
                        display: "block",
                      }}
                      allowFullScreen
                    />
                )}
              {/* 🔹 Title */}
              <h2 style={{ marginBottom: "8px" }}>{source.title}</h2>
              <button onClick={() => handleShare(source)}>
                Share
              </button>

              {/* 🔹 Summary */}
              <p style={{ marginBottom: "12px", color: "#555" }}>
                {source.summary || "No summary available."}
              </p>

              {/* 🔹 Actions row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontWeight: "600",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Visit Source
                </a>

                <button
                  type="button"
                  onClick={() =>
                    isLoggedIn ? handleBookmark(source.id) : requireLoginMessage()
                  }
                  disabled={isLoggedIn && bookmarked}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: isLoggedIn && bookmarked ? "not-allowed" : "pointer",
                    background: isLoggedIn && bookmarked ? "#6c757d" : "#007bff",
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>

              {/* 🔹 Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #eee",
                  paddingTop: "10px",
                }}
              >
                <div style={{ fontSize: "13px", color: "#666" }}>
                  Platform: {source.platform || "Unknown"}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* 👍 */}
                  <button
                    onClick={() =>
                      user
                        ? handleVote(source.id, "up")
                        : setActionError("You need to sign in to vote.")
                    }
                    style={{
                      background: "green",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      width: "32px",
                      height: "28px",
                      cursor: "pointer",
                    }}
                  >
                    👍
                  </button>
                  <span style={{ fontSize: "13px" }}>{source.upvotes}</span>

                  {/* 👎 */}
                  <button
                    onClick={() =>
                      user
                        ? handleVote(source.id, "down")
                        : setActionError("You need to sign in to vote.")
                    }
                    style={{
                      background: "#dc3545",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      width: "32px",
                      height: "28px",
                      cursor: "pointer",
                    }}
                  >
                    👎
                  </button>
                  <span style={{ fontSize: "13px" }}>{source.downvotes}</span>

                  <strong style={{ marginLeft: "6px" }}>
                    Score: {source.score}
                  </strong>
                </div>
              </div>
            </div>
        );
      })}
    </>
  );
}

export default SourceList;