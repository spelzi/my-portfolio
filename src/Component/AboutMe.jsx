import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DownloadSection from "./DownloadSection";
import img2 from "./image/crypto Academy certificate.png";
import img3 from "./image/Screenshot 2025-06-28 at 12.30.50 PM.png";
import img from "./image/web developer certificate.png";

const skillSets = [
  {
    title: "Full Stack Web Developer",
    icon: "fa-solid fa-code",
    skills: [
      "HTML5 / CSS3",
      "JavaScript (ES6+)",
      "ReactJS",
      "Node.js / Express",
      "MongoDB / MySQL",
      "Git & GitHub",
      "jQuery",
    ],
  },
  {
    title: "Crypto & Forex Trader",
    icon: "fa-solid fa-chart-line",
    skills: [
      "Smart Money Concepts (SMC)",
      "Price Action & Order Flow",
      "Technical Analysis",
      "Chart Patterns",
      "Supply & Demand Zones",
      "Fibonacci Retracement",
      "Risk Management",
      "Trading Psychology",
    ],
  },
  {
    title: "Business Consultant",
    icon: "fa-solid fa-briefcase",
    skills: [
      "Strategic Growth Planning",
      "Digital Marketing",
      "Project Management",
      "Sales & CRM",
      "Leadership & Mentorship",
      "Financial Acumen",
      "Networking",
      "Analytical Reasoning",
    ],
  },
];

const certificates = [
  { img: img, label: "Full Stack Web Development", issuer: "GoMyCode" },
  { img: img2, label: "SMC Crypto Trading Academy", issuer: "XM Academy" },
  {
    img: img3,
    label: "Comtemporary Brand indentity design",
    issuer: "Domestika",
  },
];

/* ─── Certificate lightbox — full-size viewer, closes on backdrop click / × / Escape ─── */
const Lightbox = ({ cert, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="cert-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={cert.label}
    >
      <button
        className="cert-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <img
        src={cert.img}
        alt={cert.label}
        className="cert-lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />

      <div
        className="cert-lightbox-caption"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="label">{cert.label}</p>
        <p className="issuer">{cert.issuer}</p>
      </div>
    </div>
  );
};

const AboutMe = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="aboutme-page" id="top">
      {lightbox && (
        <Lightbox cert={lightbox} onClose={() => setLightbox(null)} />
      )}

      {/* ─── Bio ─── */}
      <section className="aboutme-bio">
        <Container>
          <div className="aboutme-bio-inner">
            <p className="section-label">About Me</p>
            <h1 className="aboutme-title">
              Uzor Emmanuel
              <br />
              <span className="accent">Chidiebube</span>
            </h1>
            <div className="gold-rule left" />
            <p>
              Hello! I'm <strong>Uzor Emmanuel Chidiebube</strong> — a
              passionate and results-driven{" "}
              <strong>Full Stack Web Developer</strong>,{" "}
              <strong>Crypto &amp; Forex Trader</strong>, and{" "}
              <strong>Business Consultant</strong> based in Lagos, Nigeria.
            </p>
            <p>
              I bring over{" "}
              <strong>
                5 years of experience in cryptocurrency and 2 years in forex
                markets
              </strong>
              , with deep knowledge of centralized and decentralized exchanges.
              My expertise covers <strong>spot and derivative trading</strong>,{" "}
              <strong>DeFi</strong>, <strong>Degen strategies</strong>, and
              advanced market frameworks including <em>Smart Money Concepts</em>
              , <em>Order Flow</em>, <em>Risk Management</em> , and{" "}
              <em>Price Action</em>.
            </p>
            <p>
              Beyond trading, I actively educate others through a dedicated{" "}
              <strong>Telegram community</strong> and create{" "}
              <strong>engaging trading content</strong> across social media.
            </p>
            <p>
              I hold a <strong>Diploma in Full Stack Web Development</strong>{" "}
              with a focus on frontend technologies, and I have hands-on
              experience building responsive, modern web applications using{" "}
              <strong>
                HTML, CSS, JavaScript, ReactJS, Supabase, vite-React.js and
                MongoDB
              </strong>
              .
            </p>
            <p>
              As a <strong>Business Consultant</strong>, I help startups and
              entrepreneurs with strategic growth, digital marketing, youTube
              studio management, adsense, operational efficiency and more. With
              added skills as an <strong>IT Technician/Specialist</strong>, I
              provide a unique combination of technical, financial, and business
              acumen.
            </p>
            <p className="aboutme-cta">
              <a
                href="https://www.linkedin.com/in/emmanuel-chidiebube-uzor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lux"
              >
                Connect on LinkedIn
              </a>
            </p>
          </div>
        </Container>
      </section>
      <section className="aboutme-download">
        <Container>
          <h3 className="docu-pdf-header">My Documentation</h3>
          <div className="gold-rule " />
          <DownloadSection />
        </Container>
      </section>

      {/* ─── Skills ─── */}
      <section className="aboutme-skills">
        <Container>
          <p className="section-label">Expertise</p>
          <h2 className="aboutme-skills-title">Areas of Knowledge</h2>
          <div className="gold-rule" />
          <Row>
            {skillSets.map((set) => (
              <Col lg={4} md={6} key={set.title}>
                <div className="skill-card">
                  <i
                    className={`${set.icon} skill-card-icon`}
                    aria-hidden="true"
                  />
                  <h4>{set.title}</h4>
                  <ul>
                    {set.skills.map((s) => (
                      <li key={s}>
                        <span className="bullet">›</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ─── Certificates ─── */}
      <section className="aboutme-certs">
        <Container>
          <p className="section-label">Credentials</p>
          <h2 className="aboutme-certs-title">Certificates Acquired</h2>
          <p className="aboutme-certs-hint">
            Click any certificate to view full size
          </p>
          <div className="gold-rule" />

          <Row className="justify-content-center">
            {certificates.map((cert, i) => (
              <Col lg={4} md={6} key={i}>
                <div
                  className="cert-tile"
                  onClick={() => setLightbox(cert)}
                  title="Click to view full size"
                >
                  <div className="cert-tile-img-wrap">
                    <img
                      src={cert.img}
                      alt={cert.label}
                      className="cert-tile-img"
                    />
                    <div className="cert-tile-hint">
                      <span>View Full Size</span>
                    </div>
                  </div>
                  <p className="cert-tile-label">{cert.label}</p>
                  <p className="cert-tile-issuer">{cert.issuer}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutMe;
