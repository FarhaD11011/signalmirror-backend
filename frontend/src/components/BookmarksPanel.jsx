function BookmarksPanel({ bookmarks, handleRemoveBookmark }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        marginBottom: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h2>My Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.bookmark_id}
            style={{
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{bookmark.title}</strong>

            <div style={{ marginTop: "6px" }}>
              <a href={bookmark.url} target="_blank" rel="noreferrer">
                Visit Source
              </a>
            </div>

            <button
              onClick={() => handleRemoveBookmark(bookmark.source_id)}
              style={{
                marginTop: "8px",
                padding: "6px 10px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                background: "#dc3545",
                color: "white",
              }}
            >
              Remove Bookmark
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default BookmarksPanel;