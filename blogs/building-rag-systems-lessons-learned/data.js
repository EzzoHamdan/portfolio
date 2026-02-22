/**
 * Post Data: Building RAG Systems in Production: Lessons Learned
 * 
 * This file contains the metadata and content for a single blog post.
 */

const BLOG_POST = {
  slug: "building-rag-systems-lessons-learned",
  title: "Building RAG Systems in Production: Lessons Learned",
  date: "2026-02-15",
  readTime: "8 min read",
  tags: ["AI", "RAG", "NLP"],
  excerpt: "After deploying retrieval-augmented generation systems at Altibbi, here are the hard-won lessons about chunking strategies, embedding pipelines, and the importance of a solid evaluation framework.",
  thumbnail: "",
  content: `
    <p class="blog-lead">Retrieval-Augmented Generation (RAG) has quickly become the go-to architecture for grounding large language models in domain-specific knowledge. But moving from a prototype to a production system surfaces challenges that no tutorial prepares you for.</p>

    <p>During my time at <strong>Altibbi</strong>, I built and deployed a 3-layer RAG stack that served medical queries with strict source citation. This article distils the key lessons from that journey.</p>

    <h2>1. Chunking Is an Art, Not a Science</h2>
    <p>The first instinct is to split documents by a fixed token count. That works for homogeneous corpora, but medical literature mixes short Q&amp;A pairs with long clinical guidelines. We ended up building a <em>hybrid chunker</em> that:</p>
    <ul>
      <li>Detects section boundaries via heading patterns and HTML structure.</li>
      <li>Falls back to recursive character splitting when no structure is found.</li>
      <li>Preserves metadata (source URL, section title, last-updated date) in every chunk.</li>
    </ul>
    <p>Metadata turned out to be just as important as the text itself — without it, citations were impossible.</p>

    <h2>2. Embedding Pipelines Need Caching &amp; Hashing</h2>
    <p>Re-embedding 100k+ documents on every pipeline run is expensive and slow. We introduced a content-hash layer: each chunk gets an SHA-256 hash, and only chunks with changed hashes are re-embedded. This dropped our nightly pipeline from <strong>3 hours to ~15 minutes</strong>.</p>
    <pre><code>import hashlib

def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()
</code></pre>
    <p>Simple, but it saved real money on API calls and compute.</p>

    <h2>3. The Retrieval Layer Needs Multiple Strategies</h2>
    <p>Pure cosine-similarity retrieval works for direct factual queries. But nuanced questions — <em>"What are the contraindications of ibuprofen for a patient with kidney disease?"</em> — need a refinement step that rewrites the query before retrieval.</p>
    <p>Our final architecture used three layers:</p>
    <ol>
      <li><strong>Classification</strong> — determine intent and expected answer type.</li>
      <li><strong>Refinement</strong> — expand the query with medical context.</li>
      <li><strong>Retrieval</strong> — fetch from Milvus / Qdrant with filtered metadata.</li>
    </ol>

    <h2>4. Evaluation Is Non-Negotiable</h2>
    <p>Without systematic evaluation you're flying blind. We built a test harness of 200 curated question-answer pairs, scored on:</p>
    <ul>
      <li><strong>Faithfulness</strong> — does the answer stick to retrieved context?</li>
      <li><strong>Relevance</strong> — did we retrieve the right chunks?</li>
      <li><strong>Citation accuracy</strong> — every claim must map to a source.</li>
    </ul>
    <p>This harness caught regressions every time we tweaked chunking or retrieval parameters.</p>

    <h2>Key Takeaway</h2>
    <p>RAG is deceptively simple in demos and deceptively hard in production. Invest early in <strong>metadata preservation</strong>, <strong>caching</strong>, and <strong>evaluation</strong> — they compound into a system you can actually trust.</p>

    <p>If you're working on something similar, feel free to <a href="https://www.linkedin.com/in/ezzhamdan/" target="_blank" rel="noopener noreferrer">reach out on LinkedIn</a> — always happy to chat about RAG architectures.</p>
  `
};
