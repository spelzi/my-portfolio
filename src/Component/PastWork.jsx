import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { defaultProjects } from "./Admin/AdminPastWork";
import { AdminStore } from "./Admin/AdminStore";
import { getStaticRouteMeta } from "../seo/seoConfig";
import { useSeo } from "../seo/useSeo";

const statusSlug = (status) => (status || "").toLowerCase().replace(/\s+/g, "-");

const PastWork = () => {
  const [projects, setProjects] = useState(defaultProjects);
  useSeo(getStaticRouteMeta("/pastwork"));

  useEffect(() => {
    let cancelled = false;
    AdminStore.getProjects(defaultProjects).then((data) => {
      if (!cancelled) setProjects(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pastwork-page" id="top">
      <section className="pastwork-section">
        <Container>
          <p className="section-label">Portfolio</p>
          <h1 className="pastwork-title">Selected Work</h1>
          <div className="gold-rule" />
          {projects.map((p, i) => {
            // Standardizes stack into an array seamlessly
            const stack = Array.isArray(p.stack)
              ? p.stack
              : (p.stack || "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
            return (
              <div key={p.id} className={`pastwork-row${i === 0 ? " first" : ""}`}>
                <Row className="align-items-start">
                  <Col md={1}>
                    <span className="pastwork-index">{String(i + 1).padStart(2, "0")}</span>
                  </Col>
                  <Col md={7} className="pastwork-main">
                    <p className="pastwork-category">{p.category}</p>
                    <h2 className="pastwork-project-title">{p.title}</h2>
                    <p className="pastwork-desc">{p.desc}</p>
                    <div className="pastwork-stack">
                      {stack.map((s) => (
                        <span key={s} className="pastwork-stack-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </Col>
                  <Col md={4} className="pastwork-side">
                    <span className={`pastwork-status status-${statusSlug(p.status)}`}>
                      {p.status}
                    </span>
                    <div className="pastwork-btn-group">
                      {p.link && (
                        <a
                          href={p.link}
                          target={p.link.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="btn-lux pastwork-link-btn"
                        >
                          View Project
                        </a>
                      )}
                      {p.link1 && (
                        <a
                          href={p.link1}
                          target={p.link1.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="btn-lux pastwork-link-btn"
                        >
                          GitHub Link...
                        </a>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
          {!projects.length && <p className="pastwork-empty">No projects added yet.</p>}
        </Container>
      </section>
    </div>
  );
};

export default PastWork;
