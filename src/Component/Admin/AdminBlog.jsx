import { useEffect, useState } from "react";
import LoadingButton from "../LoadingButton";
import { posts as defaultPosts } from "../postsData";
import { AdminStore } from "./AdminStore";

const CATS = ["Trading", "Web Dev", "Business"];

const emptyPost = {
  slug: "",
  title: "",
  category: "Trading",
  date: "",
  readTime: "",
  excerpt: "",
  content: [{ type: "p", text: "" }],
};

const genSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const AdminBlog = ({ onCountChange }) => {
  const [posts, setPosts] = useState(defaultPosts);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', data: {} }
  const [delId, setDelId] = useState(null);
  const [form, setForm] = useState(emptyPost);
  const [bodyText, setBodyText] = useState(""); // raw textarea, split by \n\n → paragraphs

  useEffect(() => {
    let cancelled = false;
    AdminStore.getPosts(defaultPosts).then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
        onCountChange?.(data.length);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optimistically updates the UI, then persists to the backend. Rolls
  // back and alerts on failure — unlike the old localStorage version,
  // a network save can genuinely fail (offline, expired session, etc.).
  const save = async (updated) => {
    const previous = posts;
    setPosts(updated);
    try {
      await AdminStore.savePosts(updated);
      onCountChange?.(updated.length);
    } catch (err) {
      setPosts(previous);
      alert(`Failed to save: ${err.message}`);
      throw err;
    }
  };

  const openAdd = () => {
    setForm({ ...emptyPost });
    setBodyText("");
    setModal({ mode: "add" });
  };

  const openEdit = (post) => {
    setForm({ ...post });
    // Flatten content blocks back to plain text
    setBodyText(
      post.content
        .map((b) => {
          if (b.type === "p") return b.text;
          if (b.type === "h2") return `## ${b.text}`;
          if (b.type === "blockquote") return `> ${b.text}`;
          if (b.type === "ul") return b.items.map((i) => `- ${i}`).join("\n");
          return "";
        })
        .join("\n\n")
    );
    setModal({ mode: "edit", slug: post.slug });
  };

  const parseBody = (raw) => {
    const blocks = [];
    raw.split(/\n\n+/).forEach((chunk) => {
      const c = chunk.trim();
      if (!c) return;
      if (c.startsWith("## ")) {
        blocks.push({ type: "h2", text: c.slice(3).trim() });
      } else if (c.startsWith("> ")) {
        blocks.push({ type: "blockquote", text: c.slice(2).trim() });
      } else if (c.startsWith("- ")) {
        blocks.push({
          type: "ul",
          items: c
            .split("\n")
            .filter((l) => l.startsWith("- "))
            .map((l) => l.slice(2).trim()),
        });
      } else {
        blocks.push({ type: "p", text: c });
      }
    });
    return blocks.length ? blocks : [{ type: "p", text: raw }];
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Title is required.");
    const slug = form.slug || genSlug(form.title);
    const post = { ...form, slug, content: parseBody(bodyText) };

    let updated;
    if (modal.mode === "add") {
      updated = [post, ...posts];
    } else {
      updated = posts.map((p) => (p.slug === modal.slug ? post : p));
    }
    try {
      await save(updated);
      setModal(null);
    } catch {
      // error already alerted inside save() — keep the modal open to retry
    }
  };

  const handleDelete = async () => {
    try {
      await save(posts.filter((p) => p.slug !== delId));
      setDelId(null);
    } catch {
      // error already alerted inside save()
    }
  };

  const f = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div>
      <div className="adm-toolbar">
        <div>
          <h1 className="adm-page-title">Blog Posts</h1>
          <p className="adm-page-sub">
            {posts.length} post{posts.length !== 1 ? "s" : ""} · Changes are live for every visitor
          </p>
        </div>
        <LoadingButton className="adm-btn" onClick={openAdd}>
          + New Post
        </LoadingButton>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Read Time</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="adm-table-empty">
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              posts.map((p) => (
                <tr key={p.slug}>
                  <td className="title-cell">
                    <span className="adm-table-row-title">{p.title}</span>
                    <br />
                    <span className="is-muted">/blog/{p.slug}</span>
                  </td>
                  <td>
                    <span className="adm-badge tone-gold">{p.category}</span>
                  </td>
                  <td>{p.date}</td>
                  <td>{p.readTime}</td>
                  <td className="align-right no-wrap">
                    <LoadingButton
                      className="adm-btn adm-btn-outline adm-btn-sm adm-btn-gap"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </LoadingButton>
                    <LoadingButton
                      className="adm-btn adm-btn-danger adm-btn-sm"
                      onClick={() => setDelId(p.slug)}
                    >
                      Delete
                    </LoadingButton>
                  </td>
                </tr>
              ))}
            {!loading && !posts.length && (
              <tr>
                <td colSpan={5} className="adm-table-empty">
                  No posts yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Add / Edit Modal ─── */}
      {modal && (
        <div className="adm-modal-bg" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.mode === "add" ? "New Blog Post" : "Edit Post"}</h3>

            <div className="adm-field">
              <label className="adm-label">Title *</label>
              <input
                className="adm-input"
                value={form.title}
                onChange={f("title")}
                placeholder="Post title"
              />
            </div>
            <div className="adm-field-row">
              <div className="adm-field">
                <label className="adm-label">Category</label>
                <select className="adm-select" value={form.category} onChange={f("category")}>
                  {CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Date (e.g. Mar 2025)</label>
                <input
                  className="adm-input"
                  value={form.date}
                  onChange={f("date")}
                  placeholder="Mar 2025"
                />
              </div>
            </div>
            <div className="adm-field-row">
              <div className="adm-field">
                <label className="adm-label">Read Time</label>
                <input
                  className="adm-input"
                  value={form.readTime}
                  onChange={f("readTime")}
                  placeholder="8 min read"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Slug (auto-generated if blank)</label>
                <input
                  className="adm-input"
                  value={form.slug}
                  onChange={f("slug")}
                  placeholder="leave blank to auto-generate"
                />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Excerpt (shown on card)</label>
              <textarea
                className="adm-textarea is-short"
                value={form.excerpt}
                onChange={f("excerpt")}
                placeholder="Short summary of the post..."
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">
                Content — use ## for headings, &gt; for quotes, - for bullet lists (blank line
                separates blocks)
              </label>
              <textarea
                className="adm-textarea is-tall is-code"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder={`Opening paragraph here.\n\n## Section Heading\n\nAnother paragraph.\n\n> A pullquote goes here.\n\n- Bullet item one\n- Bullet item two`}
              />
            </div>

            <div className="adm-modal-foot">
              <button className="adm-btn adm-btn-outline" onClick={() => setModal(null)}>
                Cancel
              </button>
              <LoadingButton className="adm-btn" onClick={handleSubmit}>
                {modal.mode === "add" ? "Publish Post" : "Save Changes"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete confirm ─── */}
      {delId && (
        <div className="adm-modal-bg">
          <div className="adm-modal is-narrow">
            <h3>Delete this post?</h3>
            <p className="adm-modal-text">This cannot be undone.</p>
            <div className="adm-modal-foot is-centered">
              <button className="adm-btn adm-btn-outline" onClick={() => setDelId(null)}>
                Cancel
              </button>
              <LoadingButton
                className="adm-btn adm-btn-danger adm-btn-confirm-delete"
                onClick={handleDelete}
              >
                Delete
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
