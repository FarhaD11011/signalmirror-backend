import SourceList from "./SourceList";

function FeedSection({ loading, error, sources, isBookmarked, handleBookmark }) {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error: {error}</h2>;
  }

  return (
    <SourceList
      sources={sources}
      isBookmarked={isBookmarked}
      handleBookmark={handleBookmark}
    />
  );
}

export default FeedSection;