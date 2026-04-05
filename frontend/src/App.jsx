import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import BookmarksPanel from "./components/BookmarksPanel";
import PendingSourcesPanel from "./components/PendingSourcesPanel";
import SourceList from "./components/SourceList";
import SourceForm from "./components/SourceForm";
import CategoryFilter from "./components/CategoryFilter";
import MessageBanner from "./components/MessageBanner";
import UserStatusBar from "./components/UserStatusBar";
import FeedSection from "./components/FeedSection";
import PageContainer from "./components/PageContainer";
import AppHeader from "./components/AppHeader";
import SearchBar from "./components/SearchBar";
import SortBar from "./components/SortBar";



function App() {
  // ✅ auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ app data state
  const [sources, setSources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [bookmarks, setBookmarks] = useState([]);
  const [pendingSources, setPendingSources] = useState([]);

  // ✅ ui state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmittingSource, setIsSubmittingSource] = useState(false);

  // ✅ source submission form state
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceSummary, setSourceSummary] = useState("");
  const [sourceImageUrl, setSourceImageUrl] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("");
  const [sourceCategoryId, setSourceCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingSourceId, setProcessingSourceId] = useState(null);


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
      const res = await fetch("http://localhost:5001/api/bookmarks", {
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
      const res = await fetch("http://localhost:5001/api/admin/pending", {
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
    }
    setError("");
    let url = "http://localhost:5001/api/sources";
    if (selectedCategory) {
      url += `?category_id=${selectedCategory}`;
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
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    if (showLoader) {
      setLoading(false);
    }
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
        const res = await fetch("http://localhost:5001/api/categories");
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
    fetchSources();
  }, [selectedCategory]);


  // ✅ login handler
  async function handleLogin(e) {
    e.preventDefault();
    setSuccessMessage("");
    setActionError("");
    if (!email.trim() || !password.trim()) {
      setActionError("Please enter both email and password");
      return;
    }
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
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
    const res = await fetch("http://localhost:5001/api/sources", {
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
      const res = await fetch("http://localhost:5001/api/bookmarks", {
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
        `http://localhost:5001/api/bookmarks/${sourceId}`,
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
      const res = await fetch("http://localhost:5001/api/votes", {
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
        `http://localhost:5001/api/admin/approve/${sourceId}`,
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
        `http://localhost:5001/api/admin/reject/${sourceId}`,
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


// ✅ Main-return
  return (
    <PageContainer>
      <AppHeader />
      <MessageBanner type="success" message={successMessage} />
      <MessageBanner type="error" message={actionError} />
      
      {!user ? (
        <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        ) : (
          <UserStatusBar user={user} handleLogout={handleLogout} />
      )}

      {user && (
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

      {user && (
          <BookmarksPanel
            bookmarks={bookmarks}
            handleRemoveBookmark={handleRemoveBookmark}
      />
      )}

      {user?.role === "admin" && (
        <PendingSourcesPanel
          pendingSources={pendingSources}
          handleApproveSource={handleApproveSource}
          handleRejectSource={handleRejectSource}
          processingSourceId={processingSourceId}
  />
      )}

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
    </PageContainer>
  );
}

export default App;