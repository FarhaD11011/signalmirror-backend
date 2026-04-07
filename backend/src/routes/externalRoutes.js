const express = require("express");
const Parser = require("rss-parser");

const router = express.Router();
const parser = new Parser();

// 🌍 Multiple RSS sources
const RSS_FEEDS = [
  // 🟦 General
  { name: "CNN", url: "http://rss.cnn.com/rss/edition.rss" },
  { name: "ABC News", url: "https://abcnews.go.com/abcnews/topstories" },
  { name: "CBS News", url: "https://www.cbsnews.com/latest/rss/main" },

  // 🟩 International
  { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },

  // 🟨 Tech
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },

  // 🟪 BBC (keep some)
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "BBC Technology", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
];

// ✅ GET /api/external/rss-news
router.get("/rss-news", async (req, res) => {
  try {
    const allItems = [];

    // 🔁 Fetch each feed
    for (const feedSource of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedSource.url);

        // ✅ limit 5 per feed
        const normalizedItems = (feed.items || []).slice(0, 5).map((item) => ({
          title: item.title || "Untitled",
          url: item.link || "",
          summary:
            item.contentSnippet ||
            item.content ||
            item.summary ||
            "No summary available.",
          image_url: item.enclosure?.url || null,
          platform: "RSS",
          source_name: feedSource.name,
          published_at: item.isoDate || item.pubDate || null,
        }));

        allItems.push(...normalizedItems);
      } catch (feedError) {
        console.error(`RSS feed failed: ${feedSource.name}`, feedError.message);
      }
    }

    // ✅ Deduplicate by URL
    const uniqueItems = [];
    const seenUrls = new Set();

    for (const item of allItems) {
      if (!item.url || seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      uniqueItems.push(item);
    }

    // ✅ Sort newest first
    uniqueItems.sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at) : new Date(0);
      const dateB = b.published_at ? new Date(b.published_at) : new Date(0);
      return dateB - dateA;
    });

    // ✅ Return top 20
    res.json({
      success: true,
      count: uniqueItems.length,
      sources: uniqueItems.slice(0, 20),
    });
  } catch (error) {
    console.error("Error fetching RSS news:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch RSS news",
      error: error.message,
    });
  }
});

module.exports = router;