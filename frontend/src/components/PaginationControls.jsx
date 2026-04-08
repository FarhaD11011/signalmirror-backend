function PaginationControls({
  currentPage,
  totalPages,
  totalSources,
  onPrevious,
  onNext,
  isPageChanging,
}) {
  const previousDisabled = currentPage === 1 || isPageChanging;
  const nextDisabled =
    currentPage >= totalPages || totalPages === 0 || isPageChanging;

  return (
    <div
      style={{
        marginTop: "24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={previousDisabled}
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: previousDisabled ? "not-allowed" : "pointer",
          background: previousDisabled ? "#6c757d" : "#007bff",
          color: "white",
        }}
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        style={{
          padding: "8px 12px",
          border: "none",
          borderRadius: "6px",
          cursor: nextDisabled ? "not-allowed" : "pointer",
          background: nextDisabled ? "#6c757d" : "#007bff",
          color: "white",
        }}
      >
       Next
      </button>

      <span>Total sources: {totalSources}</span>
    </div>
  );
}

export default PaginationControls;