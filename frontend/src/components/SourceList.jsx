function SourceList({
  sources,
  isBookmarked,
  handleBookmark,
  handleVote,
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

  return (
    <>
      {sources.map((source) => {
        const bookmarked = isBookmarked(source.id);
        const isLoggedIn = !!user;

        return (
          <div
            key={source.id}
            style={{
              background: "white",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{source.title}</h2>
            <p>{source.summary}</p>

            <a href={source.url} target="_blank" rel="noreferrer">
              Visit Source
            </a>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                onClick={() =>
                  isLoggedIn ? handleBookmark(source.id) : requireLoginMessage()
                }
                disabled={isLoggedIn && bookmarked}
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    isLoggedIn && bookmarked ? "not-allowed" : "pointer",
                  background:
                    isLoggedIn && bookmarked ? "#6c757d" : "#007bff",
                  color: "white",
                }}
              >
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>

              

              
            </div>

            {!isLoggedIn && (
              <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>
                Sign in to bookmark or vote.
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              <strong>Platform:</strong> {source.platform || "Unknown"}
            </div>

              <div style={{ marginTop: "14px" }}>

               <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {/* 👍 */}
                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={() =>
                          user
                            ? handleVote(source.id, "up")
                            : setActionError("You need to sign in to vote.")
                        }
                        style={{
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          background: "green",
                          color: "white",
                          fontSize: "18px",
                          width: "34px",
                          height: "30px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        }}
                      >
                        👍
                      </button>
                      
                      <div style={{ fontSize: "14px", marginTop: "4px" }}>
                        {source.upvotes}
                      </div>
                    </div>

                    {/* 👎 */}
                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={() =>
                          user
                            ? handleVote(source.id, "down")
                            : setActionError("You need to sign in to vote.")
                        }
                        style={{
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          background: "#dc3545",
                          color: "white",
                          fontSize: "18px",
                          width: "34px",
                          height: "30px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        }}
                      >
                        👎
                      </button>
                      <div style={{ fontSize: "14px", marginTop: "4px" }}>
                        {source.downvotes}
                      </div>
                    </div>

                    {/* Score */}
                    <div
                      style={{
                        marginLeft: "8px",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      Score: {source.score}
                    </div>
                  </div>
          </div>
        </div>
        );
      })}
    </>
  );
}

export default SourceList;