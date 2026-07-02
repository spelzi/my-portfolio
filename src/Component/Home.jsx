import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Anima from "./Anima";
import Contact from "./Contact";
import profileImg from "./image/EC0543FF-F3DB-4B6A-9AC7-2E3E97D524AB.PNG";
import { getStaticRouteMeta, personJsonLd } from "../seo/seoConfig";
import { useSeo } from "../seo/useSeo";

function Home() {
  useSeo(getStaticRouteMeta("/"), [personJsonLd()]);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="hero-watermark" aria-hidden="true">
          STM
        </div>

        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <span className="hero-label">Portfolio · Lagos, Nigeria</span>
                <h1 className="hero-name">
                  St <em>Manuel</em>
                </h1>
                <p className="hero-roles">
                  Web Developer
                  <span>·</span>
                  Crypto &amp; Forex Trader
                  <span>·</span>
                  Business Consultant
                </p>
                <p className="hero-desc">
                  Building digital solutions and navigating financial markets with 7+ years of
                  experience across technology, trading, and business strategy.
                </p>
                <div className="hero-ctas">
                  <Link to="/pastwork" className="btn-lux-solid">
                    View My Work
                  </Link>
                  <Link to="/aboutme" className="btn-lux">
                    About Me
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={6} className="hero-anima d-none d-lg-flex">
              <Anima />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ─── About snapshot ─── */}
      <section className="about-section" id="about">
        <Container>
          <Row className="align-items-start">
            <Col lg={7}>
              <div className="about-inner">
                <span className="section-label">Who I am</span>
                <h2>
                  Uzor Emmanuel
                  <br />
                  Chidiebube
                </h2>
                <div className="gold-rule left" />

                <div className="exp-grid">
                  <div className="exp-card">
                    <i className="fa-solid fa-trophy" aria-hidden="true"></i>
                    <h5>Experience</h5>
                    <p>
                      2 yrs — Web Development
                      <br />
                      5 yrs — Crypto Trading
                      <br />
                      2 yrs — Forex Trading
                      <br />
                      2 yrs — Business Consulting
                      <br />1 yr — IT Specialist
                    </p>
                  </div>
                  <div className="exp-card">
                    <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
                    <h5>Education</h5>
                    <ol>
                      <li>National Diploma in Steel Fabrication Engineering Technology</li>
                      <li>Diploma in Full Stack Web Development</li>
                    </ol>
                  </div>
                </div>

                <p>
                  A proficient cryptocurrency trader with over 5 years of deep experience, with
                  comprehensive understanding of both decentralised and centralised exchanges,
                  mastered use of blockchain technology, and expertise in spot and derivative
                  trading, DeFi, and Degen strategies. My journey also includes educating others
                  through a dedicated Telegram channel and creating engaging trading content for
                  social media.
                </p>
                <p>
                  Additionally, holding a diploma in Full Stack Development with a focus on
                  frontend, I possess hands-on experience in creating innovative tech solutions —
                  coupled with robust knowledge in social media marketing, business consulting, and
                  IT.
                </p>
                <a href="/aboutme" className="btn-lux">
                  Full Profile →
                </a>
              </div>
            </Col>

            <Col lg={1} />

            <Col lg={4}>
              <div className="profile-sidebar">
                <img src={profileImg} alt="Uzor Emmanuel Chidiebube" className="profile-img" />

                <div className="profile-details">
                  {[
                    ["Name", "Uzor Emmanuel Chidiebube"],
                    ["Email", "uzorchidiebube19@gmail.com"],
                    ["City", "Ikeja, Lagos"],
                    ["Country", "Nigeria"],
                  ].map(([key, val]) => (
                    <div className="profile-detail-row" key={key}>
                      <strong>{key}</strong>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>

                <div className="social-row">
                  <a
                    href="https://www.linkedin.com/in/emmanuel-chidiebube-uzor"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://t.me/stmempire"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                  >
                    <i className="fa-brands fa-telegram" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://github.com/spelzi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <i className="fa-brands fa-github" aria-hidden="true"></i>
                  </a>
                  <a
                    href="https://x.com/st_manuel1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                  >
                    <i className="fa-brands fa-x-twitter" aria-hidden="true"></i>
                  </a>
                </div>

                <p className="contact-head">Send a message</p>
                <Contact />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
