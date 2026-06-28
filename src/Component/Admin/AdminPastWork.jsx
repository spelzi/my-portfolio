import { useState } from "react";
import LoadingButton from "../LoadingButton";
import { AdminStore } from "./AdminStore";

const defaultProjects = [
  {
    id: "p1",
    title: "STM Styling",
    category: "Full Stack E-Commerce",
    stack: "React, Vite, Supabase, CSS3",
    desc: "A luxury fashion e-commerce platform with a complete admin panel and client dashboard.",
    status: "In Progress",
    link: "",
    link1: "",
  },
  {
    id: "p2",
    title: "Personal Portfolio",
    category: "Frontend / UI",
    stack: "React, React Router, Bootstrap, Lottie",
    desc: "This portfolio site — responsive, luxury-aesthetic, full mobile support.",
    status: "Live",
    link: "/",
    link1: "",
  },
  {
    id: "p3",
    title: "Trading Dashboard",
    category: "Frontend / Data Viz",
    stack: "React, Chart.js, REST API",
    desc: "A personal market analytics dashboard for live crypto and forex data.",
    status: "Coming Soon",
    link: "",
    link1: "",
  },
];

const STATUSES = ["Live", "In Progress", "Coming Soon", "Archived"];

const emptyProject = {
  id: "",
  title: "",
  category: "",
  stack: "",
  desc: "",
  status: "In Progress",
  link: "",
  link1: "",
};

// Maps a status label to the CSS class suffix used for its badge colour
const statusTone = (s) =>
  ({
    Live: "live",
    "In Progress": "progress",
    "Coming Soon": "soon",
    Archived: "archived",
  })[s] ?? "soon";

const AdminPastWork = ({ onCountChange }) => {
  const [projects, setProjects] = useState(() =>
    AdminStore.getProjects(defaultProjects),
  );
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null);
  const [form, setForm] = useState(emptyProject);

  const save = (updated) => {
    setProjects(updated);
    AdminStore.saveProjects(updated);
    onCountChange?.(updated.length);
  };

  const openAdd = () => {
    setForm({ ...emptyProject, id: `p_${Date.now()}` });
    setModal({ mode: "add" });
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      // Ensure stack turns cleanly into a string layout inside the modal
      stack: Array.isArray(p.stack) ? p.stack.join(", ") : p.stack || "",
      // Ensure link inputs fall back seamlessly to empty strings if missing
      link: p.link || "",
      link1: p.link1 || "",
    });
    setModal({ mode: "edit", id: p.id });
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return alert("Title is required.");

    const project = {
      ...form,
      stack: form.stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const updated =
      modal.mode === "add"
        ? [...projects, project]
        : projects.map((p) => (p.id === modal.id ? project : p));

    save(updated);
    setModal(null);
  };

  const handleDelete = () => {
    save(projects.filter((p) => p.id !== delId));
    setDelId(null);
  };

  const f = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const stackStr = (s) => (Array.isArray(s) ? s.join(", ") : s);

  return (
    <div>
      <div className="adm-toolbar">
        <div>
          <h1 className="adm-page-title">Past Work</h1>
          <p className="adm-page-sub">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <LoadingButton className="adm-btn" onClick={openAdd}>
          + Add Project
        </LoadingButton>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Stack</th>
              <th>Status</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              return (
                <tr key={p.id}>
                  <td>
                    <span className="adm-table-row-title">{p.title}</span>
                    {p.link && (
                      <>
                        <br />
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adm-table-link"
                        >
                          {p.link}
                        </a>
                      </>
                    )}
                    {p.link1 && (
                      <>
                        <br />
                        <a
                          href={p.link1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adm-table-link"
                        >
                          {p.link1}
                        </a>
                      </>
                    )}
                  </td>
                  <td className="adm-cell-sm">{p.category}</td>
                  <td className="adm-cell-stack">{stackStr(p.stack)}</td>
                  <td>
                    <span className={`adm-badge tone-${statusTone(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="align-right no-wrap">
                    <LoadingButton
                      className="adm-btn adm-btn-outline adm-btn-sm adm-btn-gap"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </LoadingButton>
                    <LoadingButton
                      className="adm-btn adm-btn-danger adm-btn-sm"
                      onClick={() => setDelId(p.id)}
                    >
                      Delete
                    </LoadingButton>
                  </td>
                </tr>
              );
            })}
            {!projects.length && (
              <tr>
                <td colSpan={5} className="adm-table-empty">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="adm-modal-bg" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.mode === "add" ? "New Project" : "Edit Project"}</h3>

            <div className="adm-field">
              <label className="adm-label">Project Title *</label>
              <input
                className="adm-input"
                value={form.title}
                onChange={f("title")}
                placeholder="STM Styling"
              />
            </div>
            <div className="adm-field-row">
              <div className="adm-field">
                <label className="adm-label">Category</label>
                <input
                  className="adm-input"
                  value={form.category}
                  onChange={f("category")}
                  placeholder="Full Stack E-Commerce"
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Status</label>
                <select
                  className="adm-select"
                  value={form.status}
                  onChange={f("status")}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Tech Stack (comma-separated)</label>
              <input
                className="adm-input"
                value={form.stack}
                onChange={f("stack")}
                placeholder="React, Supabase, Vite"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">Description</label>
              <textarea
                className="adm-textarea is-medium"
                value={form.desc}
                onChange={f("desc")}
                placeholder="Brief project description..."
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">Live URL (optional)</label>
              <input
                className="adm-input"
                value={form.link}
                onChange={f("link")}
                placeholder="https://stmstyling.com"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">GitHub URL (optional)</label>
              <input
                className="adm-input"
                value={form.link1}
                onChange={f("link1")}
                placeholder="https://github.com/spelzi/project-name"
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
                {modal.mode === "add" ? "Add Project" : "Save Changes"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {delId && (
        <div className="adm-modal-bg">
          <div className="adm-modal is-narrow">
            <h3>Delete this project?</h3>
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
                Delete
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { defaultProjects };
export default AdminPastWork;
