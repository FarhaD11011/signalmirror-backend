const express = require("express");
const Parser = require("rss-parser");

const router = express.Router();
const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
    ],
  },
});

// 🌍 Multiple RSS sources
const RSS_FEEDS = [
  // 🟦 General
  {
    title: "🟦General",
    feeds: [
      { name: "CNN", url: "http://rss.cnn.com/rss/edition.rss" },
      { name: "ABC News", url: "https://abcnews.go.com/abcnews/topstories" },
      { name: "CBS News", url: "https://www.cbsnews.com/latest/rss/main" },
    ],
  },

  // 🟩 International
  {
    title: "🟩International",
    feeds: [
      // { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    ],
  },

  // 🟨 Tech
  {
    title: "🟨Tech",
    feeds: [
      { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
      { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
    ],
  },

  // 🟪 BBC (keep some)
  {
    title: "🟪BBC",
    feeds: [
      { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
      { name: "BBC Technology", url: "https://feeds.bbci.co.uk/news/technology/rss.xml" },
    ],
  },
];

// ✅ GET /api/external/rss-news
router.get("/rss-news", async (req, res) => {
  try {
    const sections = [];
    for (const section of RSS_FEEDS) {
      const allItems = [];
      for (const feedSource of section.feeds) {
        try {
          const feed = await parser.parseURL(feedSource.url);

          const normalizedItems = (feed.items || []).slice(0, 10).map((item) => ({
              title: item.title || "Untitled",
              url: item.link || "",
              summary:
                item.contentSnippet ||
                item.content ||
                item.summary ||
                "No summary available.",
              image_url:
                item.enclosure?.url ||
                item.mediaContent?.[0]?.$?.url ||
                item.mediaThumbnail?.[0]?.$?.url ||
                null,
              platform: "RSS",
              source_name: feedSource.name,
              published_at: item.isoDate || item.pubDate || null,
            }));

          allItems.push(...normalizedItems);
        } catch (err) {
          console.error(`Feed failed: ${feedSource.name}`, err.message);
        }
      }

      // ✅ deduplicate inside section
      const uniqueItems = [];
      const seen = new Set();
      for (const item of allItems) {
        if (!item.url || seen.has(item.url)) continue;
        seen.add(item.url);
        uniqueItems.push(item);
      }

      // ✅ sort newest
      uniqueItems.sort((a, b) => {
        const dateA = a.published_at ? new Date(a.published_at) : new Date(0);
        const dateB = b.published_at ? new Date(b.published_at) : new Date(0);
        return dateB - dateA;
      });
      sections.push({
        title: section.title,
        items: uniqueItems.slice(0, 10),
      });
    }
    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error("RSS error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch RSS news",
    });
  }
});

module.exports = router;