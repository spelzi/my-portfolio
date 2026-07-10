import { useEffect, useState } from "react"; // FIX 1: removed unused React
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { AdminStore } from "./Admin/AdminStore";
import { categorySlug, posts as defaultPosts } from "./postsData";
import { getBlogPostMeta, notFoundMeta, blogPostingJsonLd } from "../seo/seoConfig";
import { useSeo } from "../seo/useSeo";

const BlogPost = () => {
  const { slug } = useParams();

  const [posts, setPosts] = useState(defaultPosts);
  // Tracks whether the live fetch has resolved at least once. Without this,
  // a post that exists in Supabase but isn't in the local `defaultPosts`
  // fallback (e.g. published after the last deploy, shared immediately)
  // would flash "Post not found" for a moment before the real data loads.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AdminStore.getPosts(defaultPosts).then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];
  // Only trust a "not found" result once the live fetch has actually
  // returned — on the very first render we've only got local defaults,
  // which may not include a post published since the last deploy.
  const notFound = loaded && !post;

  // Hooks must run unconditionally — compute meta for either state.
  useSeo(
    post ? getBlogPostMeta(post) : notFoundMeta(`/blog/${slug || ""}`),
    post ? [blogPostingJsonLd(post)] : []
  );

  // Scroll to top whenever navigating between posts (prev/next/direct link)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (notFound) {
    return (
      <div className="post-not-found">
        <div>
          <h2>Post not found</h2>
          <Link to="/blog" className="btn-lux">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Not found yet, but the fetch also hasn't resolved yet — render nothing
  // rather than a false negative. Resolves within one network round-trip.
  if (!post) return null;

  const prevPost = index > 0 ? posts[index - 1] : null;
  const nextPost = index < posts.length - 1 ? posts[index + 1] : null;

  return (
    <div className="post-page">
      {/* ─── Hero ─── */}
      <div className="post-hero">
        <Container>
          <Link to="/blog" className="post-back-link">
            ← Journal
          </Link>
          <div className="post-hero-content">
            <div className="post-hero-meta">
              <span className={`post-hero-cat cat-${categorySlug(post.category)}`}>
                {post.category}
              </span>
              <span className="post-hero-date">{post.date}</span>
              <span className="post-hero-readtime">· {post.readTime}</span>
            </div>
            <h1 className="post-hero-title">{post.title}</h1>
            <p className="post-hero-excerpt">{post.excerpt}</p>
            <div className="post-author-row">
              <div className="post-author-avatar">S</div>
              <div>
                <p className="post-author-name">St Manuel</p>
                <p className="post-author-fullname">Uzor Emmanuel Chidiebube</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ─── Article body ─── */}
      <div className="post-body-section">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} md={12}>
              <div className="post-body-content">
                {post.content.map((block, i) => {
                  if (block.type === "p") return <p key={i}>{block.text}</p>;
                  if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
                  if (block.type === "blockquote")
                    return <blockquote key={i}>{block.text}</blockquote>;
                  if (block.type === "ul") {
                    return (
                      <ul key={i}>
                        {block.items.map((item, j) => (
                          <li key={j}>
                            <span className="bullet">—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ─── Prev / Next navigation ─── */}
      <div className="post-nav-section">
        <Container>
          <div className="post-nav-row">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="post-nav-card">
                <span className="post-nav-card-label">← Previous</span>
                <span className="post-nav-card-title">{prevPost.title}</span>
              </Link>
            ) : (
              <div className="post-nav-spacer" />
            )}
            <Link to="/blog" className="post-nav-all-link">
              All Posts
            </Link>
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="post-nav-card next">
                <span className="post-nav-card-label">Next →</span>
                <span className="post-nav-card-title">{nextPost.title}</span>
              </Link>
            ) : (
              <div className="post-nav-spacer" />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default BlogPost;
