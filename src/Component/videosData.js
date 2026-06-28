/**
 * Default video data.
 * Replace youtubeId values with your real YouTube video IDs via the Admin Panel.
 * A YouTube video ID is the part after ?v= in the URL.
 * e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ → ID is dQw4w9WgXcQ
 */
export const defaultVideos = [
  {
    id: "vid_1",
    youtubeId: "", // Add via Admin Panel → Videos
    title: "Smart Money Concepts — Full Breakdown",
    category: "Crypto Trading",
    description:
      "A complete walkthrough of Smart Money Concepts, order blocks, and liquidity zones for Forex and Crypto traders.",
    date: "Apr 2025",
  },
  {
    id: "vid_2",
    youtubeId: "", // Add via Admin Panel → Videos
    title: "How to Build a React App from Scratch",
    category: "Web Development",
    description:
      "Step-by-step guide to building a full-stack React application with Vite, React Router, and Supabase as the backend.",
    date: "Mar 2025",
  },
  {
    id: "vid_3",
    youtubeId: "", // Add via Admin Panel → Videos
    title: "Forex Risk Management Masterclass",
    category: "Forex Trading",
    description:
      "Everything you need to know about protecting your capital in Forex — position sizing, stop-losses, and trading psychology.",
    date: "Feb 2025",
  },
  {
    id: "vid_4",
    youtubeId: "", // Add via Admin Panel → Videos
    title: "DeFi Deep Dive: Navigating Decentralised Finance",
    category: "Crypto Trading",
    description:
      "An introduction to DeFi — how liquidity pools, yield farming, and decentralised exchanges actually work.",
    date: "Jan 2025",
  },
  {
    id: "vid_5",
    youtubeId: "", // Add via Admin Panel → Videos
    title: "Building a Supabase Backend in 30 Minutes",
    category: "Web Development",
    description:
      "Auth, database, storage and real-time — how to wire up a complete Supabase backend for a React application.",
    date: "Dec 2024",
  },
  {
    id: "vid_6",
    youtubeId: "", // Add via Admin Panel → Videos
    title: "Digital Strategy for Entrepreneurs — 2025 Edition",
    category: "Business",
    description:
      "Practical digital marketing and growth strategy for early-stage founders and entrepreneurs in the Nigerian market.",
    date: "Nov 2024",
  },
];

/* Converts a category name to a CSS class suffix, e.g. "Web Development" -> "web-development"
   Used as `cat-${categorySlug(video.category)}` so badge colours live in CSS, not inline styles. */
export const categorySlug = (category) =>
  (category || "").toLowerCase().replace(/\s+/g, "-");
