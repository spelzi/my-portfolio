import { useState } from "react";
import LoadingButton from "../LoadingButton";
import { defaultVideos } from "../videosData";
import { AdminStore } from "./AdminStore";

const CATS = ["Crypto Trading", "Forex Trading", "Web Development", "Business"];

const emptyVideo = {
  id: "",
  youtubeId: "",
  title: "",
  category: "Crypto Trading",
  description: "",
  date: "",
};

const AdminVideos = ({ onCountChange }) => {
  const [videos, setVideos] = useState(() =>
    AdminStore.getVideos(defaultVideos),
  );
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null);
  const [form, setForm] = useState(emptyVideo);

  const save = (updated) => {
    setVideos(updated);
    AdminStore.saveVideos(updated);
    onCountChange?.(updated.length);
  };

  const openAdd = () => {
    setForm({ ...emptyVideo, id: `vid_${Date.now()}` });
    setModal({ mode: "add" });
  };
  const openEdit = (v) => {
    setForm({ ...v });
    setModal({ mode: "edit", id: v.id });
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return alert("Title is required.");
    const updated =
      modal.mode === "add"
        ? [...videos, form]
        : videos.map((v) => (v.id === modal.id ? form : v));
    save(updated);
    setModal(null);
  };

  const handleDelete = () => {
    save(videos.filter((v) => v.id !== delId));
    setDelId(null);
  };

  const f = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const thumbUrl = (id) =>
    id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  const watchUrl = (id) =>
    id ? `https://www.youtube.com/watch?v=${id}` : null;

  return (
    <div>
      <div className="adm-toolbar">
        <div>
          <h1 className="adm-page-title">Blog Videos</h1>
          <p className="adm-page-sub">
            {videos.length} video{videos.length !== 1 ? "s" : ""} · Paste
            YouTube video IDs below
          </p>
        </div>
        <LoadingButton className="adm-btn" onClick={openAdd}>
          + Add Video
        </LoadingButton>
      </div>

      {/* How to find video ID tip */}
      <div className="adm-info-banner">
        <i className="fa-solid fa-circle-info" aria-hidden="true" />
        To find a YouTube video ID: open the video on YouTube, the ID is the
        part after <code>?v=</code> in the URL. e.g. youtube.com/watch?v=
        <strong>dQw4w9WgXcQ</strong>
      </div>

      <div className="adm-video-grid">
        {videos.map((v) => (
          <div key={v.id} className="adm-video-card">
            {/* Thumbnail */}
            <div className="adm-video-thumb-wrap">
              {v.youtubeId ? (
                <img
                  src={thumbUrl(v.youtubeId)}
                  alt={v.title}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="adm-video-thumb-placeholder">
                  <i className="fa-brands fa-youtube" aria-hidden="true" />
                </div>
              )}
              {v.youtubeId && (
                <a
                  href={watchUrl(v.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="adm-video-play-overlay"
                  aria-label={`Watch "${v.title}" on YouTube`}
                >
                  <div className="adm-video-play-btn">
                    <i className="fa-solid fa-play" aria-hidden="true" />
                  </div>
                </a>
              )}
            </div>

            <div className="adm-video-body">
              <span className="adm-video-cat">{v.category}</span>
              <p className="adm-video-title">{v.title}</p>
              <p className="adm-video-id-row">
                {v.youtubeId ? (
                  <>
                    <i className="fa-brands fa-youtube" aria-hidden="true" />
                    {v.youtubeId}
                  </>
                ) : (
                  <span className="adm-video-id-missing">No video ID set</span>
                )}
              </p>
              <div className="adm-video-actions">
                <LoadingButton
                  className="adm-btn adm-btn-outline adm-btn-sm"
                  onClick={() => openEdit(v)}
                >
                  Edit
                </LoadingButton>
                <LoadingButton
                  className="adm-btn adm-btn-danger adm-btn-sm"
                  onClick={() => setDelId(v.id)}
                >
                  Delete
                </LoadingButton>
              </div>
            </div>
          </div>
        ))}
        {!videos.length && (
          <div className="adm-video-grid-empty">
            No videos yet — click "+ Add Video"
          </div>
        )}
      </div>

      {modal && (
        <div className="adm-modal-bg" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.mode === "add" ? "Add Video" : "Edit Video"}</h3>

            <div className="adm-field">
              <label className="adm-label">YouTube Video ID *</label>
              <input
                className="adm-input"
                value={form.youtubeId}
                onChange={f("youtubeId")}
                placeholder="e.g. dQw4w9WgXcQ"
              />
              {form.youtubeId && (
                <div className="adm-video-id-preview">
                  <img
                    src={thumbUrl(form.youtubeId)}
                    alt="preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="adm-field">
              <label className="adm-label">Title *</label>
              <input
                className="adm-input"
                value={form.title}
                onChange={f("title")}
                placeholder="Video title"
              />
            </div>
            <div className="adm-field-row">
              <div className="adm-field">
                <label className="adm-label">Category</label>
                <select
                  className="adm-select"
                  value={form.category}
                  onChange={f("category")}
                >
                  {CATS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Date (e.g. Apr 2025)</label>
                <input
                  className="adm-input"
                  value={form.date}
                  onChange={f("date")}
                  placeholder="Apr 2025"
                />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Description</label>
              <textarea
                className="adm-textarea is-medium"
                value={form.description}
                onChange={f("description")}
                placeholder="Short description of this video..."
              />
            </div>

            <div className="adm-modal-foot">
              <button
                className="adm-btn adm-btn-outline"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <LoadingButton className="adm-btn" onClick={handleSubmit}>
                {modal.mode === "add" ? "Add Video" : "Save Changes"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="adm-modal-bg">
          <div className="adm-modal is-narrow">
            <h3>Remove this video?</h3>
            <div className="adm-modal-foot is-centered">
              <button
                className="adm-btn adm-btn-outline"
                onClick={() => setDelId(null)}
              >
                Cancel
              </button>
              <LoadingButton
                className="adm-btn adm-btn-danger adm-btn-confirm-delete"
                onClick={handleDelete}
              >
                Remove
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;
