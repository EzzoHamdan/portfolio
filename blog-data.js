/**
 * Blog data registry — index of all articles.
 * Each post is stored in its own folder under blogs/[slug]/
 * 
 * Contents of each post folder:
 *   - index.html   (article page)
 *   - data.js      (BLOG_POST object with metadata and content)
 *
 * To add a new post:
 * 1. Create blogs/[slug]/ directory
 * 2. Create blogs/[slug]/data.js with BLOG_POST object
 * 3. Create blogs/[slug]/index.html article page
 * 4. Add an entry to BLOG_REGISTRY below
 *
 * Registry entry schema:
 * {
 *   slug:        string   – URL-friendly identifier (folder name)
 *   title:       string   – Article headline
 *   date:        string   – ISO date string (YYYY-MM-DD)
 *   readTime:    string   – Estimated reading time, e.g. "5 min read"
 *   tags:        string[] – Category labels for filtering
 *   excerpt:     string   – Short summary shown on cards
 *   thumbnail:   string   – Path to a card thumbnail (optional, falls back to gradient)
 *   path:        string   – Path to the post's index.html
 * }
 */

const BLOG_REGISTRY = [
  {
    slug: "building-rag-systems-lessons-learned",
    title: "Building RAG Systems in Production: Lessons Learned",
    date: "2026-02-15",
    readTime: "8 min read",
    tags: ["AI", "RAG", "NLP"],
    excerpt: "After deploying retrieval-augmented generation systems at Altibbi, here are the hard-won lessons about chunking strategies, embedding pipelines, and the importance of a solid evaluation framework.",
    thumbnail: "",
    path: "blogs/building-rag-systems-lessons-learned/"
  }
];
