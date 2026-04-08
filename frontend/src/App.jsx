
import { API_BASE_URL } from "./config";
import { useEffect, useRef, useState } from "react";
import LoginForm from "./components/LoginForm";
import BookmarksPanel from "./components/BookmarksPanel";
import PendingSourcesPanel from "./components/PendingSourcesPanel";
import SourceForm from "./components/SourceForm";
import CategoryFilter from "./components/CategoryFilter";
import MessageBanner from "./components/MessageBanner";
import FeedSection from "./components/FeedSection";
import PageContainer from "./components/PageContainer";
import AppHeader from "./components/AppHeader";
import SearchBar from "./components/SearchBar";
import SortBar from "./components/SortBar";
import PaginationControls from "./components/PaginationControls";
import RssNewsSection from "./components/RssNewsSection";
import NavBar from "./components/NavBar";
import FeedModeBar from "./components/FeedModeBar";


function App() {
  // ✅ auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  // ✅ app data state
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [bookmarks, setBookmarks] = useState([]);
  const [pendingSources, setPendingSources] = useState([]);

  // ✅ frontend-pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSources, setTotalSources] = useState(0);
  const [pageLimit] = useState(5);
  
  // ✅ ui state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmittingSource, setIsSubmittingSource] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [activeView, setActiveView] = useState("feed");
  const [feedMode, setFeedMode] = useState("all");

  // ✅ source submission form state
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceSummary, setSourceSummary] = useState("");
  const [sourceImageUrl, setSourceImageUrl] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [sourceCategoryId, setSourceCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingSourceId, setProcessingSourceId] = useState(null);

  // ✅ ....
  const [rssSources, setRssSources] = useState([]);
  const [rssLoading, setRssLoading] = useState(true);
  const [rssError, setRssError] = useState("");

  // ✅ global action messages (replace alert)
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");


  // ✅ fetch bookmarks
  async function fetchBookmarks() {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setBookmarks([]);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bookmarks");
      }
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      console.error("Bookmark fetch error:", err.message);
    }
  }

  // ✅ fetch pending sources for admin
  async function fetchPendingSources() {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setPendingSources([]);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/admin/pending`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch pending sources");
      }
      setPendingSources(data.sources || []);
    } catch (err) {
      console.error("Pending sources fetch error:", err.message);
    }
  }

  // ✅ fetch public sources
async function fetchSources(showLoader = true) {
  try {
    if (showLoader) {
      setLoading(true);
    } else {
      setIsPageChanging(true);
    }
    setError("");
    let url = `${API_BASE_URL}/api/sources?page=${currentPage}&limit=${pageLimit}`;
    if (selectedCategory) {
      url += `&category_id=${selectedCategory}`;
    }
    const savedToken = localStorage.getItem("token");
    const res = await fetch(url, {
      headers: savedToken
        ? { Authorization: `Bearer ${savedToken}` }
        : {},
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch sources");
    }
    setSources(data.sources || []);
    setTotalPages(data.totalPages || 1);
    setTotalSources(data.totalSources || 0);
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    if (showLoader) {
      setLoading(false);
    } else {
      setIsPageChanging(false);
    }
  }
}

  // ✅ fetch:
  async function fetchRssSources() {
    try {
      setRssLoading(true);
      setRssError("");
      const res = await fetch(`${API_BASE_URL}/api/external/rss-news`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch RSS news");
      }
      setRssSources(data.sections || []);
    } catch (err) {
      setRssError(err.message || "Something went wrong");
    } finally {
      setRssLoading(false);
    }
  }

  // ✅ helper: check whether a source is already bookmarked
  function isBookmarked(sourceId) {
    if (!Array.isArray(bookmarks)) return false;
    return bookmarks.some((bookmark) => bookmark?.source_id === sourceId);
  }

  // ✅ fetch categories on first load
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch categories");
        }
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Category fetch error:", err.message);
      }
    }
    fetchCategories();
  }, []);

  // ✅ 	success/error message appears
  useEffect(() => {
  if (!successMessage && !actionError) return;
  const timer = setTimeout(() => {
    setSuccessMessage("");
    setActionError("");
  }, 2500);
  return () => clearTimeout(timer);
}, [successMessage, actionError]);

  // ✅ restore login on page refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      fetchBookmarks();
      if (parsedUser.role === "admin") {
        fetchPendingSources();
      }
    }
  }, []);

  // ✅ load sources when category changes
  useEffect(() => {
    fetchSources(currentPage === 1);
    }, [selectedCategory, currentPage]);

  // ✅ 
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // ✅ 
  useEffect(() => {
  fetchRssSources();
  }, []);

//   useEffect(() => {
//   if (currentPage > 1 && feedTopRef.current) {
//     feedTopRef.current.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   }
// }, [currentPage]);

  async function handleSignup(e) {
  e.preventDefault();
  setSuccessMessage("");
  setActionError("");
  if (!email.trim() || !password.trim()) {
    setActionError("Email and password are required");
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email.split("@")[0], // simple username
        email,
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }
    setSuccessMessage("Signup successful. You can now log in.");
    setAuthMode("login"); // switch back to login
  } catch (err) {
    setActionError(err.message);
  }
}


  // ✅ login handler
  async function handleLogin(e) {
    e.preventDefault();
    setSuccessMessage("");
    setActiveView("feed");
    setActionError("");
    if (!email.trim() || !password.trim()) {
      setActionError("Please enter both email and password");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("LOGIN USER:", data.user);
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await fetchBookmarks();
      if (data.user.role === "admin") {
        await fetchPendingSources();
      }
      setEmail("");
      setPassword("");
      setSuccessMessage("Login successful");
    } catch (err) {
      setActionError(err.message);
    }
  }

  // ✅ submit new source
async function handleSubmitSource(e) {
  e.preventDefault();
  setSuccessMessage("");
  setActionError("");
  if (!user) {
    setActionError("You must be logged in to submit a source.");
    return;
  }
  if (!sourceTitle.trim()) {
    setActionError("Title is required.");
    return;
  }
  if (!sourceUrl.trim()) {
    setActionError("URL is required.");
    return;
  }
  if (!sourceUrl.trim().startsWith("http")) {
    setActionError("URL must start with http or https.");
    return;
  }
  setIsSubmittingSource(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/sources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: sourceTitle.trim(),
        url: sourceUrl.trim(),
        summary: sourceSummary.trim() || null,
        image_url: sourceImageUrl.trim() || null,
        platform: sourcePlatform.trim() || null,
        category_id: sourceCategoryId ? Number(sourceCategoryId) : null,
        submitter_id: user.id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit source");
    }
    setSuccessMessage(data.message || "Source submitted successfully");
    setSourceTitle("");
    setSourceUrl("");
    setSourceSummary("");
    setSourceImageUrl("");
    setSourcePlatform("");
    setSourceCategoryId("");
    if (user.role === "admin") {
      await fetchPendingSources();
    }
  } catch (err) {
    setActionError(err.message);
  } finally {
    setIsSubmittingSource(false);
  }
}

    // ✅ logout handler
    function handleLogout() {
      setUser(null);
      setToken(null);
      setBookmarks([]);
      setPendingSources([]);
      setSuccessMessage("");
      setActionError("");
      setActiveView("feed");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

  // ✅ add bookmark
  async function handleBookmark(sourceId) {
    setSuccessMessage("");
    setActionError("");
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setActionError("You must be logged in to bookmark");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          source_id: sourceId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Bookmark failed");
      }
      setSuccessMessage(data.message || "Bookmark added successfully");
      await fetchBookmarks();
    } catch (err) {
      setActionError(err.message);
    }
  }

  // ✅ remove bookmark
  async function handleRemoveBookmark(sourceId) {
    setSuccessMessage("");
    setActionError("");
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setActionError("You must be logged in.");
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/api/bookmarks/${sourceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove bookmark");
      }
      setSuccessMessage(data.message || "Bookmark removed successfully");
      await fetchBookmarks();
    } catch (err) {
      console.error("Remove bookmark error:", err.message);
      setActionError(err.message);
    }
  }

  // ✅ vote on a source
  async function handleVote(sourceId, voteType) {
    setSuccessMessage("");
    setActionError("");
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setActionError("You must be logged in to vote.");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          source_id: sourceId,
          vote_type: voteType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save vote");
      }
      setSuccessMessage(data.message || "Vote saved successfully");
      await fetchSources(false);
    } catch (err) {
      setActionError(err.message);
    }
  }

  // ✅ approve pending source
  async function handleApproveSource(sourceId) {
    setSuccessMessage("");
    setActionError("");
    setProcessingSourceId(sourceId);
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setActionError("You must be logged in.");
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/api/admin/approve/${sourceId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to approve source");
      }
      setSuccessMessage(data.message || "Source approved successfully");
      await fetchPendingSources();
      await fetchSources();
    } catch (err) {
      console.error("Approve source error:", err.message);
      setActionError(err.message);
    } finally{
      setProcessingSourceId(null);
    }
  }

  // ✅ reject pending source
  async function handleRejectSource(sourceId) {
    setSuccessMessage("");
    setActionError("");
    setProcessingSourceId(sourceId);
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setActionError("You must be logged in.");
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/api/admin/reject/${sourceId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reject source");
      }
      setSuccessMessage(data.message || "Source rejected successfully");
      await fetchPendingSources();
      await fetchSources(false); // ✅ silent refresh
    } catch (err) {
      console.error("Reject source error:", err.message);
      setActionError(err.message);
    } finally{
      setProcessingSourceId(null);
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredSources = sources.filter((source) => {
  const titleMatch = source.title.toLowerCase().includes(normalizedSearch);
  const summaryMatch = source.summary
    ? source.summary.toLowerCase().includes(normalizedSearch)
    : false;
  return titleMatch || summaryMatch;
  });
  const sortedSources = [...filteredSources].sort((a, b) => {
  if (sortBy === "score") {
    return b.score - a.score;
  }
  if (sortBy === "upvotes") {
    return b.upvotes - a.upvotes;
  }
  // default: newest
  return new Date(b.created_at) - new Date(a.created_at);
  });

  function handlePreviousPage() {
  setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

// ✅ Main-return
  return (
    <PageContainer>
      <AppHeader />
      <MessageBanner type="success" message={successMessage} />
      <MessageBanner type="error" message={actionError} />
      
      {user && (
        <NavBar
          user={user}
          activeView={activeView}
          setActiveView={setActiveView}
          handleLogout={handleLogout}
        />
      )}
      {!user && (
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          authMode={authMode}
          setAuthMode={setAuthMode}
        />
    )}

      {user && activeView === "submit" && (
        <SourceForm
          sourceTitle={sourceTitle}
          setSourceTitle={setSourceTitle}
          sourceUrl={sourceUrl}
          setSourceUrl={setSourceUrl}
          sourceSummary={sourceSummary}
          setSourceSummary={setSourceSummary}
          sourceImageUrl={sourceImageUrl}
          setSourceImageUrl={setSourceImageUrl}
          sourcePlatform={sourcePlatform}
          setSourcePlatform={setSourcePlatform}
          sourceCategoryId={sourceCategoryId}
          setSourceCategoryId={setSourceCategoryId}
          categories={categories}
          handleSubmitSource={handleSubmitSource}
          isSubmittingSource={isSubmittingSource}
        />
      )}

      {user && activeView === "bookmarks" && (
          <BookmarksPanel
            bookmarks={bookmarks}
            handleRemoveBookmark={handleRemoveBookmark}
      />
      )}

      {user?.role === "admin" && activeView === "pending" && (
        <PendingSourcesPanel
          pendingSources={pendingSources}
          handleApproveSource={handleApproveSource}
          handleRejectSource={handleRejectSource}
          processingSourceId={processingSourceId}
  />
      )}
          {activeView === "feed" && (
            <>
            <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "20px",
              }}
            >
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
        />
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <SortBar
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
          <FeedModeBar
            feedMode={feedMode}
            setFeedMode={setFeedMode}
          />
          {(feedMode === "all" || feedMode === "external") && (
          <RssNewsSection
            rssSources={rssSources}
            rssLoading={rssLoading}
            rssError={rssError}
            />
          )}
          {(feedMode === "all" || feedMode === "general") && (
            <> 
          <h2 style={{ marginBottom: "12px" }}>General Feed</h2>

          <FeedSection
            loading={loading}
            error={error}
            sources={sortedSources}
            isBookmarked={isBookmarked}
            handleBookmark={handleBookmark}
            handleVote={handleVote}
            user={user}
            setActionError={setActionError}
            setSuccessMessage={setSuccessMessage}
        />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalSources={totalSources}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            isPageChanging={isPageChanging}
            />
           </>
            )}
       </>
      )}
    </PageContainer>
  );
}

export default App;