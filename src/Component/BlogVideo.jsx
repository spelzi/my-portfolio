import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AdminStore } from "./Admin/AdminStore";
import { categorySlug, defaultVideos } from "./videosData";
import { getStaticRouteMeta } from "../seo/seoConfig";
import { useSeo } from "../seo/useSeo";

/* ─── Individual video card ───
   Hover  → mutes & autoplays a YouTube iframe preview over the thumbnail.
   Click  → opens the real YouTube watch page (counts as a genuine view there). */
const VideoCard = ({ video }) => {
  const [hovered, setHovered] = useState(false);
  const [iframeMounted, setIframeMounted] = useState(false); // only load the iframe after first hover, to save bandwidth
  const [thumbError, setThumbError] = useState(false);

  const hasId = Boolean(video.youtubeId);
  const thumbUrl = hasId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : null;
  const watchUrl = hasId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : null;
  const embedUrl = hasId
    ? `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.youtubeId}&rel=0&modestbranding=1`
    : null;

  const handleMouseEnter = () => {
    setHovered(true);
    if (hasId) setIframeMounted(true);
  };

  return (
    <div
      className={`video-card${hovered ? " is-hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="video-card-media">
        {iframeMounted && hasId && (
          <iframe
            src={embedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title={video.title}
            className={`video-card-iframe${hovered ? " is-visible" : ""}`}
          />
        )}

        {hasId && !thumbError ? (
          <img
            src={thumbUrl}
            alt={video.title}
            onError={() => setThumbError(true)}
            className={`video-card-thumb${hovered ? " is-hidden" : ""}`}
          />
        ) : (
          <div className={`video-card-placeholder${hovered ? " is-hidden" : ""}`}>
            <i className="fa-brands fa-youtube" aria-hidden="true" />
          </div>
        )}

        <div className={`video-card-play-overlay${hovered ? " is-hidden" : ""}`}>
          <div className="video-card-play-btn">
            <i className="fa-solid fa-play" aria-hidden="true" />
          </div>
        </div>

        {hasId && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch "${video.title}" on YouTube`}
            className="video-card-click-overlay"
          />
        )}

        {!hasId && <div className="video-card-no-id-badge">Add video ID in Admin</div>}
      </div>

      <div className="video-card-body">
        <div className="video-card-meta">
          <span className={`video-card-cat cat-${categorySlug(video.category)}`}>
            {video.category}
          </span>
          <span className="video-card-date">{video.date}</span>
        </div>

        <h3 className="video-card-title">{video.title}</h3>
        <p className="video-card-desc">{video.description}</p>

        <div className="video-card-footer">
          {hasId ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="video-card-watch-link"
            >
              <i className="fa-brands fa-youtube" aria-hidden="true" />
              Watch on YouTube →
            </a>
          ) : (
            <span className="video-card-no-link">No video linked yet</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Page ─── */
const BlogVideo = () => {
  const [videos, setVideos] = useState(defaultVideos);
  useSeo(getStaticRouteMeta("/blogvideo"));

  useEffect(() => {
    let cancelled = false;
    AdminStore.getVideos(defaultVideos).then((data) => {
      if (!cancelled) setVideos(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="video-page" id="top">
      <section className="video-page-section">
        <Container>
          <p className="section-label">Video Content</p>
          <h1 className="video-page-title">Watch &amp; Learn</h1>
          <p className="video-page-subtitle">Hover to preview · Click to watch on YouTube</p>
          <div className="gold-rule" />

          <Row>
            {videos.map((v) => (
              <Col lg={4} md={6} key={v.id} className="video-card-col">
                <VideoCard video={v} />
              </Col>
            ))}
          </Row>

          <div className="video-page-footer">
            <a
              href="https://www.youtube.com/@St_manuel1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lux"
            >
              <i className="fa-brands fa-youtube" aria-hidden="true" />
              More on YouTube
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BlogVideo;
