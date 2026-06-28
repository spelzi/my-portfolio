const AdminDashboard = ({ counts, goTo }) => {
  const cards = [
    {
      label: "Blog Posts",
      value: counts.posts,
      icon: "fa-newspaper",
      tab: "blog",
    },
    {
      label: "Projects",
      value: counts.projects,
      icon: "fa-briefcase",
      tab: "pastwork",
    },
    {
      label: "Videos",
      value: counts.videos,
      icon: "fa-circle-play",
      tab: "videos",
    },
  ];

  const tips = [
    "All changes save instantly to this browser. They won't sync to other devices yet.",
    "Use the Blog tab to write posts with headings (##), quotes (>), and bullet lists (-).",
    'Paste a YouTube video ID in the Videos tab — copy it from the URL after "?v=".',
    "Click any certificate on the About page to view it full-size with the new lightbox.",
  ];

  return (
    <div>
      <h1 className="adm-page-title">Dashboard</h1>
      <p className="adm-page-sub">
        Welcome back. Here's an overview of your content.
      </p>

      <div className="adm-stats">
        {cards.map((c) => (
          <div
            key={c.label}
            className="adm-stat is-clickable"
            onClick={() => goTo(c.tab)}
          >
            <i
              className={`fa-solid ${c.icon} adm-stat-icon`}
              aria-hidden="true"
            />
            <div className="adm-stat-num">{c.value}</div>
            <div className="adm-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="adm-tips-box">
        <h3 className="adm-tips-title">Quick Tips</h3>
        <ul className="adm-tips-list">
          {tips.map((tip, i) => (
            <li key={i}>
              <span className="bullet">—</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
