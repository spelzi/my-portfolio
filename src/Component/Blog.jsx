import { useState } from "react"; // FIX 1: removed React + unused useEffect
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AdminStore } from "./Admin/AdminStore";
import { categorySlug, posts as defaultPosts } from "./postsData";

const Blog = () => {
  const [posts] = useState(() => AdminStore.getPosts(defaultPosts));

  return (
    <div className="blog-page" id="top">
      <section className="blog-page-section">
        <Container>
          <p className="section-label">Journal</p>
          <h1 className="blog-page-title">Thoughts &amp; Insights</h1>
          <div className="gold-rule" />
          <Row>
            {posts.map((post) => (
              <Col lg={4} md={6} key={post.slug} className="blog-card-col">
                <Link
                  to={`/blog/${post.slug}`}
                  className="blog-post-card-read-link"
                >
                  <div className="blog-post-card">
                    <div className="blog-post-card-body">
                      <div className="blog-post-card-meta">
                        <span
                          className={`blog-post-card-cat cat-${categorySlug(post.category)}`}
                        >
                          {post.category}
                        </span>
                        <span className="blog-post-card-date">{post.date}</span>
                      </div>
                      <h3 className="blog-post-card-title">{post.title}</h3>
                      <p className="blog-post-card-excerpt">{post.excerpt}</p>
                    </div>
                    <div className="blog-post-card-footer">
                      <span className="blog-post-card-readtime">
                        <i className="fa-regular fa-clock" aria-hidden="true" />
                        {post.readTime}
                      </span>
                      Read →
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Blog;
