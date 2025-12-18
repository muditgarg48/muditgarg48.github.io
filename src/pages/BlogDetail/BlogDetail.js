import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';
import { fetchBlogById, formatBlogDate } from '../../services/blogUtils';
import BackIcon from '../../assets/svg/BackIcon';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBlog = await fetchBlogById(id);
        if (!fetchedBlog) {
          setError('Blog not found');
        } else {
          setBlog(fetchedBlog);
        }
      } catch (err) {
        console.error('Error loading blog:', err);
        setError('Failed to load blog. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBlog();
    }
  }, [id]);

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={index} className="blog-content-text">
            <p>{block.value}</p>
          </div>
        );

      case 'image':
        return (
          <div key={index} className="blog-content-image">
            <img 
              src={block.value} 
              alt="Blog content" 
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        );

      case 'link':
        return (
          <div key={index} className="blog-content-link">
            <a 
              href={block.value} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {block.placeholder || block.value}
            </a>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="blog-content-code">
            {block.title && (
              <div className="blog-content-code-header">
                <span className="blog-content-code-title">
                  {block.title}
                </span>
                {block.language && (
                  <span className="blog-content-code-language">
                    {block.language}
                  </span>
                )}
              </div>
            )}
            <pre className="blog-content-code-block">
              <code>{block.value}</code>
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !blog) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-error">
          <p>{error || 'Blog not found'}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/blogs')}
          >
            <div className="back-button-icon">
              <BackIcon />
            </div>
            <span className="back-button-text">Back to Blog Wall</span>
            <div className="back-button-glow"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <button 
        className="back-button"
        onClick={() => navigate('/blogs')}
        title="Back to Blog Wall"
      >
        <div className="back-button-icon">
          <BackIcon />
        </div>
        <span className="back-button-text">Back to Blog Wall</span>
        <div className="back-button-glow"></div>
      </button>

      <article className="blog-detail-content">
        <header className="blog-detail-header">
          <h1 className="blog-detail-title">
            {blog.title || 'Untitled'}
          </h1>
          
          <div className="blog-detail-meta">
            <span className="blog-detail-meta-text">
              {formatBlogDate(blog.createdAt, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {blog.timeToRead && (
              <>
                <span className="blog-detail-separator">•</span>
                <span className="blog-detail-meta-text">
                  {blog.timeToRead}
                </span>
              </>
            )}
          </div>

          <div className="blog-detail-stats">
            <span className="blog-detail-stats-text">
              {blog.views || 0} views
            </span>
            {blog.likes != null && (
              <>
                <span className="blog-detail-separator">•</span>
                <span className="blog-detail-stats-text">
                  {blog.likes} likes
                </span>
              </>
            )}
          </div>

          {blog.tags?.length > 0 && (
            <div className="blog-detail-tags">
              {blog.tags.map((tag, index) => (
                <span key={index} className="blog-detail-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="blog-detail-body">
          {blog.content?.length > 0 ? (
            blog.content.map((block, index) => renderContentBlock(block, index))
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;

