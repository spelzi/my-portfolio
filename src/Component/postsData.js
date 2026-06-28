export const posts = [
  {
    slug: "understanding-smart-money-concepts-forex",
    date: "Mar 2025",
    category: "Trading",
    title: "Understanding Smart Money Concepts in Forex",
    excerpt:
      "A deep dive into how institutional traders move markets — and how retail traders can align with that flow using SMC, order blocks, and liquidity zones.",
    readTime: "8 min read",
    content: [
      {
        type: "p",
        text: "Most retail traders lose money not because they lack discipline or intelligence, but because they are playing a different game than the institutions that actually move price. Smart Money Concepts (SMC) is a framework that tries to bridge that gap — to help you see the market the way a bank or hedge fund sees it.",
      },
      {
        type: "p",
        text: "After seven years trading cryptocurrency and two years in Forex, SMC is the lens through which I now read every chart. Here is what I have learned.",
      },
      {
        type: "h2",
        text: "What is 'Smart Money'?",
      },
      {
        type: "p",
        text: "Smart money refers to institutional participants — central banks, commercial banks, hedge funds, and proprietary trading firms — whose orders are large enough to visibly move price on a chart. They cannot simply enter a trade the way a retail trader can. A bank cannot buy $500 million in EUR/USD by pressing a button; they need liquidity, which means they need a counterparty.",
      },
      {
        type: "p",
        text: "This is the fundamental insight that SMC is built on: institutions manufacture price movement to engineer the liquidity they need to fill their positions.",
      },
      {
        type: "h2",
        text: "Liquidity Zones: Where Smart Money Hunts",
      },
      {
        type: "p",
        text: "Retail traders cluster their stop-losses in predictable places — just below swing lows, just above swing highs, at round numbers, and below trendlines. Smart money knows this. When they need to buy, they will often drive price down into those stop clusters first, triggering a flood of sell orders that gives them the liquidity to fill their long positions at a discount.",
      },
      {
        type: "blockquote",
        text: "Stop-loss hunts are not random volatility. They are institutional order-filling events. Your stop is their entry.",
      },
      {
        type: "p",
        text: "This is why you so often see price spike violently through a key level, trigger a wave of stops, then reverse sharply in the other direction. That reversal is institutions entering after collecting the liquidity they needed.",
      },
      {
        type: "h2",
        text: "Order Blocks",
      },
      {
        type: "p",
        text: "An order block is the last bullish or bearish candle before a strong impulsive move in the opposite direction. It represents the candle where institutional orders were placed. Because institutions often cannot fill their entire position in one move, they leave unfilled orders at that level — which means price frequently returns to an order block before continuing its intended direction.",
      },
      {
        type: "ul",
        items: [
          "Bullish order block: the last bearish (red) candle before a strong bullish impulse",
          "Bearish order block: the last bullish (green) candle before a strong bearish impulse",
          "Valid order blocks break the structure of the prior move — weak moves do not qualify",
          "The stronger the departure impulse, the higher-quality the order block",
        ],
      },
      {
        type: "h2",
        text: "Fair Value Gaps (FVG)",
      },
      {
        type: "p",
        text: "When price moves so aggressively that the wicks of three consecutive candles do not overlap, it leaves an imbalance in the market — a Fair Value Gap. This gap represents an area where orders were not properly matched, and price has a statistical tendency to retrace into these zones to fill those orders before continuing the primary trend.",
      },
      {
        type: "p",
        text: "FVGs are particularly powerful when they align with an order block or a key liquidity zone. That confluence is where I take my highest-conviction trades.",
      },
      {
        type: "h2",
        text: "My Entry Framework",
      },
      {
        type: "p",
        text: "I do not use SMC in isolation. My entries require at least three of the following to align on a higher timeframe before I drill down to a lower timeframe for execution:",
      },
      {
        type: "ul",
        items: [
          "Identified institutional bias (higher timeframe market structure is bullish or bearish)",
          "Price has swept a liquidity zone (stop hunt has occurred)",
          "Price is retesting a high-quality order block",
          "A Fair Value Gap is present within the order block zone",
          "Lower timeframe confirms a change of character (CHoCH)",
        ],
      },
      {
        type: "h2",
        text: "The Hard Part Nobody Talks About",
      },
      {
        type: "p",
        text: "SMC setups look obvious in hindsight. The challenge is that in real-time, you will see many potential setups that do not play out. The discipline is in only trading the highest-conviction confluence zones and accepting that sitting on your hands is a valid position.",
      },
      {
        type: "p",
        text: "I missed more winning trades waiting for the right setup than I lost by trading impulsively. But my win rate and risk-to-reward improved dramatically once I accepted that selectivity is the edge.",
      },
    ],
  },
  {
    slug: "building-full-stack-ecommerce-react-supabase",
    date: "Feb 2025",
    category: "Web Dev",
    title: "Building a Full Stack E-Commerce App with React & Supabase",
    excerpt:
      "From a 5-step product upload wizard to real-time order tracking — here's how I architected STM Styling end-to-end with React, Vite and Supabase.",
    readTime: "12 min read",
    content: [
      {
        type: "p",
        text: "STM Styling started as a client project and became one of the most technically complete things I have built. It is a full-stack fashion e-commerce platform with a public storefront, a customer dashboard, and a comprehensive admin panel called Manal — all powered by a single Supabase backend.",
      },
      {
        type: "p",
        text: "This is the architecture writeup I wish I had when I started. Here is how it all fits together.",
      },
      {
        type: "h2",
        text: "The Stack",
      },
      {
        type: "ul",
        items: [
          "Frontend: React 19, Vite 8, React Router v7, React Bootstrap",
          "Backend: Supabase (PostgreSQL, Auth, Storage, Realtime)",
          "State: React Context API with custom hooks",
          "Styling: CSS custom properties with a luxury design system",
          "Deployment: Vercel (frontend) + Supabase hosted backend",
        ],
      },
      {
        type: "h2",
        text: "The Admin Panel: Manal",
      },
      {
        type: "p",
        text: "The admin panel has ten distinct sections: dashboard overview, products, orders, categories, customers, reviews, employees, banners, payment gateways, and site content. The most complex of these is the product management system.",
      },
      {
        type: "h2",
        text: "The 5-Step Product Upload Wizard",
      },
      {
        type: "p",
        text: "Uploading a product in most admin panels is a single dense form. I broke it into a five-step wizard with progress indication, which dramatically reduced input errors and made the flow feel intentional rather than overwhelming.",
      },
      {
        type: "ul",
        items: [
          "Step 1 — Basic Info: name, description, category, brand",
          "Step 2 — Pricing & Inventory: price, compare-at price, SKU, stock quantity",
          "Step 3 — Variants: sizes, colours, custom attribute combinations",
          "Step 4 — Media: drag-and-drop image upload to Supabase Storage with preview",
          "Step 5 — Review & Publish: full summary before submission",
        ],
      },
      {
        type: "h2",
        text: "Supabase Auth and Row-Level Security",
      },
      {
        type: "p",
        text: "One of the most important architectural decisions was how to separate admin access from customer access. Supabase's Row Level Security (RLS) made this clean. Every table has policies that check the user's role, stored in a profiles table that references auth.users.",
      },
      {
        type: "blockquote",
        text: "RLS means the database enforces access control — not just your frontend code. Even if someone bypasses the UI, the data stays protected at the query level.",
      },
      {
        type: "h2",
        text: "The safeDb() Wrapper",
      },
      {
        type: "p",
        text: "One pattern I am particularly happy with is a safeDb() wrapper around all Supabase calls. If the Supabase environment variables are missing (common in local development or CI), it falls back to demo data instead of crashing. This made development significantly smoother — pages always render, even without a live database.",
      },
      {
        type: "h2",
        text: "Real-Time Order Updates",
      },
      {
        type: "p",
        text: "Supabase's Realtime feature meant I could subscribe to order table changes and push live updates to both the customer dashboard and the admin panel without writing a single WebSocket handler. The implementation is three lines of code and it just works.",
      },
      {
        type: "h2",
        text: "What I Would Do Differently",
      },
      {
        type: "ul",
        items: [
          "Use React Query instead of raw useEffect for data fetching — the caching and invalidation logic alone would have saved me weeks",
          "Set up TypeScript from the start — Supabase generates types from your schema and the DX is excellent",
          "Implement Supabase Edge Functions earlier for operations like sending email receipts",
          "Write tests for the safeDb wrapper and the product wizard state machine from day one",
        ],
      },
    ],
  },
  {
    slug: "digital-strategy-entrepreneurs-2025",
    date: "Jan 2025",
    category: "Business",
    title: "Digital Strategy for Entrepreneurs in 2025",
    excerpt:
      "Lessons from consulting early-stage startups: how to build a digital presence that converts, retain customers, and scale sustainably in a crowded market.",
    readTime: "6 min read",
    content: [
      {
        type: "p",
        text: "I have consulted for entrepreneurs across Lagos, helping them build or rebuild their digital presence. The same patterns come up again and again — both the mistakes that stall businesses and the moves that unlock growth. Here is what I have learned.",
      },
      {
        type: "h2",
        text: "The Biggest Mistake: Building Before Validating",
      },
      {
        type: "p",
        text: "The first thing most entrepreneurs want when they come to me is a website. A beautiful, fully-featured website. But a website is not a business strategy — it is a tool. Before I write a single line of code or design a single page, I ask the same question: who is the customer, where do they spend time online, and what is the one action we need them to take?",
      },
      {
        type: "p",
        text: "The answer to those three questions determines every other decision. Everything else is a distraction until you have answered them clearly.",
      },
      {
        type: "h2",
        text: "Your Website Is Not Your Digital Strategy",
      },
      {
        type: "p",
        text: "A website is a destination. Your digital strategy is how people find it and what happens when they do. I have seen businesses with stunning websites getting zero traffic and businesses with basic pages generating consistent revenue — because the second group understood the journey their customer takes before landing on a page.",
      },
      {
        type: "blockquote",
        text: "Traffic without conversion is expensive. Conversion without traffic is quiet. You need both, and they require different thinking.",
      },
      {
        type: "h2",
        text: "What Actually Works Right Now",
      },
      {
        type: "ul",
        items: [
          "Short-form video on Instagram and TikTok still has organic reach most other channels have lost",
          "WhatsApp Business for customer retention — Nigeria's highest engagement channel by far",
          "Google Business Profile for local service businesses — free and underutilised",
          "Email lists are still the only channel you own outright — social platforms change their algorithms, your list does not",
          "Consistency beats virality — posting reliably for 90 days will outperform one viral moment for most businesses",
        ],
      },
      {
        type: "h2",
        text: "Retention Is the Strategy Most People Skip",
      },
      {
        type: "p",
        text: "Acquiring a new customer costs five to seven times more than retaining an existing one. Yet most of the businesses I consult for spend all their time and money on acquisition and almost nothing on retention. The highest-leverage move for most small businesses is not getting more customers — it is getting existing customers to come back and to refer others.",
      },
      {
        type: "h2",
        text: "Measurement: Know Your Numbers",
      },
      {
        type: "p",
        text: "You cannot improve what you do not measure. At minimum, every entrepreneur should know their cost per acquisition, their customer lifetime value, and their month-on-month retention rate. These three numbers tell you whether your business model is fundamentally sound. Everything else is tactics.",
      },
    ],
  },
  {
    slug: "defi-risk-management-what-i-learned",
    date: "Dec 2024",
    category: "Trading",
    title: "DeFi Risk Management: What I Learned the Hard Way",
    excerpt:
      "After 7 years in crypto, the most important skill is not finding the right trade — it's surviving the wrong one. My framework for managing risk in DeFi.",
    readTime: "9 min read",
    content: [
      {
        type: "p",
        text: "Seven years in cryptocurrency is a long time. Long enough to have lived through multiple 80% drawdowns, two DeFi summers, several exchange collapses, a few near-misses with rug pulls, and more sleepless nights watching a position move against me than I care to count.",
      },
      {
        type: "p",
        text: "The thing that has kept me in this market — and profitable across those cycles — is not finding the right trades. It is surviving the wrong ones.",
      },
      {
        type: "h2",
        text: "The Position Sizing Rule I Live By",
      },
      {
        type: "p",
        text: "I never risk more than 1–2% of my total portfolio on any single trade. This sounds conservative, and it is. If I am wrong ten times in a row at 1% risk, I have lost roughly 10% of my portfolio. I can recover from that. If I am risking 10% per trade and wrong three times in a row, I am down 30% and my edge needs to be significantly larger just to break even.",
      },
      {
        type: "blockquote",
        text: "The goal of risk management is not to maximize returns on winning trades. It is to still be playing when your next big opportunity arrives.",
      },
      {
        type: "h2",
        text: "DeFi-Specific Risks That Traditional Finance Does Not Teach You",
      },
      {
        type: "ul",
        items: [
          "Smart contract risk: the code can have bugs that get exploited. Only use protocols that have been audited and battle-tested",
          "Impermanent loss: providing liquidity in an AMM is not the same as holding. Understand the mechanics before depositing",
          "Bridge risk: cross-chain bridges are statistically the highest-risk point in DeFi. Only bridge what you can afford to lose",
          "Key management: if you do not control your private keys, you do not control your assets. Hardware wallets are not optional",
          "Liquidity risk: in a market crash, selling an illiquid DeFi position can cost you more than the crash itself",
        ],
      },
      {
        type: "h2",
        text: "The Protocol Due Diligence Checklist",
      },
      {
        type: "p",
        text: "Before depositing anything into a DeFi protocol, I ask these questions:",
      },
      {
        type: "ul",
        items: [
          "Has it been audited by a reputable firm? (Certik, Trail of Bits, Spearbit)",
          "How long has it been live in production without an exploit?",
          "What is the TVL and is it growing or declining?",
          "Who are the founders and are they doxxed?",
          "Is the yield sustainable or is it token emissions-driven (i.e., a farm that will collapse when rewards end)?",
        ],
      },
      {
        type: "h2",
        text: "The Mental Side of Risk",
      },
      {
        type: "p",
        text: "No risk management framework works if you cannot follow it under pressure. The moment that tests your system is not when you are up 300% — it is when you are down 40% and everything in you wants to average down or revenge trade.",
      },
      {
        type: "p",
        text: "I set my stop-losses before I enter a trade. I do not move them once set. I do not check prices every five minutes on positions I have sized correctly. These habits are not natural — they are built through painful experience. Start building them before you need them.",
      },
    ],
  },
  {
    slug: "why-i-chose-supabase-over-firebase",
    date: "Nov 2024",
    category: "Web Dev",
    title: "Why I Chose Supabase Over Firebase for STM Styling",
    excerpt:
      "Postgres under the hood, real-time subscriptions, row-level security, and a free tier that actually makes sense. The case for Supabase in production.",
    readTime: "7 min read",
    content: [
      {
        type: "p",
        text: "When I started planning the STM Styling backend, Firebase was the obvious choice. It is what most tutorials recommend, it is well-documented, and I had used it before. I chose Supabase instead. Here is why, and whether I would make the same call again.",
      },
      {
        type: "h2",
        text: "The Core Difference",
      },
      {
        type: "p",
        text: "Firebase is built on NoSQL (Firestore). Supabase is built on PostgreSQL. For an e-commerce application where data has clear relationships — products have categories, orders have line items, customers have addresses — relational data is the natural fit. I did not want to denormalize my entire data model to work around a document database's limitations.",
      },
      {
        type: "h2",
        text: "Row Level Security Changes Everything",
      },
      {
        type: "p",
        text: "Supabase's Row Level Security is PostgreSQL's built-in access control at the row level. With a few SQL policies, I was able to enforce that customers can only see their own orders, admins can see everything, and public visitors can only read published products. This access control lives in the database — not in my application code. That means even a client-side bug cannot leak data it should not have access to.",
      },
      {
        type: "blockquote",
        text: "In Firebase, security lives in your rules file and your application code. In Supabase, security lives in the database. One of these is much harder to accidentally bypass.",
      },
      {
        type: "h2",
        text: "Pricing That Makes Sense",
      },
      {
        type: "p",
        text: "Firebase's pricing is read/write operation-based, which means a real-time listener that updates frequently can generate unexpected costs at scale. Supabase's free tier gives you a full PostgreSQL database, 1GB of file storage, 50,000 monthly active users, and 500MB of bandwidth. The Pro tier is a flat $25/month. For a client project at early scale, that predictability matters.",
      },
      {
        type: "h2",
        text: "The Supabase Client Is Excellent",
      },
      {
        type: "ul",
        items: [
          "Auto-generated TypeScript types from your database schema",
          "A query builder that reads like SQL but feels like ORM",
          "Real-time subscriptions with three lines of code",
          "Built-in Auth with social providers, email magic links, and phone OTP",
          "Edge Functions for server-side logic in TypeScript",
          "Storage with direct-to-bucket uploads and public/private access control",
        ],
      },
      {
        type: "h2",
        text: "What Firebase Still Does Better",
      },
      {
        type: "p",
        text: "I want to be fair. Firebase's offline persistence is genuinely excellent and still ahead of Supabase for mobile-first apps. Firebase Analytics and Crashlytics are also deeply integrated with the Google ecosystem in a way Supabase cannot match. And if your team is already deep in the Google Cloud stack, staying there has real operational advantages.",
      },
      {
        type: "h2",
        text: "Would I Choose Supabase Again?",
      },
      {
        type: "p",
        text: "For any project involving relational data, yes — without hesitation. For a mobile app where offline sync is critical, I would reconsider. The decision always comes back to your data model and your team's existing expertise. But for full-stack web apps built with React, Supabase is the backend I reach for first.",
      },
    ],
  },
  {
    slug: "building-crypto-trading-community-telegram",
    date: "Oct 2024",
    category: "Trading",
    title: "Building a Crypto Trading Community on Telegram",
    excerpt:
      "How I grew an engaged trading community from zero — content strategy, education formats, and keeping signal-to-noise high in a bull market.",
    readTime: "5 min read",
    content: [
      {
        type: "p",
        text: "Telegram is the social network of crypto. Every serious project, every alpha group, every trading community lives there. I have been running a channel and community for several years and built an engaged following from zero. Here is what has actually worked.",
      },
      {
        type: "h2",
        text: "Why Telegram, Not Twitter/X?",
      },
      {
        type: "p",
        text: "Twitter/X is great for discovery and distribution. Telegram is where trust is built. A follower on Twitter is passive. A member of a Telegram group has actively chosen to be notified by you, which means the intent and engagement level is fundamentally higher. For a trading community specifically, Telegram lets you share charts, analysis, and real-time updates in a format that is much more usable than a tweet.",
      },
      {
        type: "h2",
        text: "The Signal-to-Noise Problem",
      },
      {
        type: "p",
        text: "The biggest failure mode for trading communities is becoming a noise machine — every pump, every rumor, every low-quality 'alpha'. Once that happens, members start muting the channel, and then leaving. Signal-to-noise ratio is the most important metric for a trading community, and it requires discipline to maintain.",
      },
      {
        type: "blockquote",
        text: "Post less, not more. Your community will trust you more for the ten things you did not post than for the hundred things you did.",
      },
      {
        type: "h2",
        text: "Content That Builds Trust",
      },
      {
        type: "ul",
        items: [
          "Trade recaps: show your full thesis, entry, exit, and what you were right and wrong about — including losses",
          "Educational breakdowns: explaining a concept like liquidity zones or funding rates in a clear, visual way",
          "Market structure updates: weekly analysis of where we are in the cycle and what the key levels are",
          "Reading list: sharing the books, papers, and resources that have shaped your thinking",
          "Community AMA: regular sessions where members can ask any question",
        ],
      },
      {
        type: "h2",
        text: "The Rule I Enforce Strictly",
      },
      {
        type: "p",
        text: "I do not share calls without a stop-loss and take-profit level. Every trade I post publicly includes my exact entry zone, my stop-loss, my target, and my position size as a percentage of portfolio. This does two things: it forces me to think rigorously before I post, and it shows members how to think about a trade rather than just copying it blindly.",
      },
      {
        type: "h2",
        text: "Monetization and Ethics",
      },
      {
        type: "p",
        text: "There is a lot of money in selling trading signals, and there is a lot of harm. The honest truth is that most signal services are not selling alpha — they are selling hope. I am careful about this. The community I have built values education over calls, and I am more proud of the members who have developed their own frameworks than of any specific winning trade I have shared.",
      },
    ],
  },
];

export const categoryColors = {
  Trading: { bg: "#FAEEDA", color: "#854F0B" },
  "Web Dev": { bg: "#E6F1FB", color: "#185FA5" },
  Business: { bg: "#EAF3DE", color: "#3B6D11" },
};

/* Converts a category name to a CSS class suffix, e.g. "Web Dev" -> "web-dev"
   Used as `cat-${categorySlug(post.category)}` so badge colours live in CSS, not inline styles. */
export const categorySlug = (category) =>
  (category || "").toLowerCase().replace(/\s+/g, "-");
