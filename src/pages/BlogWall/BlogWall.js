import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogWall.css';
import { fetchAllBlogs, formatBlogDate } from '../../services/blogUtils';
import BlogPostCard from './BlogPostCard';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import AnimatedIcon from '../../components/AnimatedIcon/AnimatedIcon';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

const home_icon = require('../../assets/icons/home.json');

const BlogWall = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBlogs = await fetchAllBlogs();
        setBlogs(fetchedBlogs);
      } catch (err) {
        console.error('Error loading blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const handlePublishClick = () => {
    // TODO: Implement publish logic
    console.log('Publish button clicked');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="blog-wall">
        <div className="blog-wall-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-wall">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
        title="Back to Home"
      >
        <div className="back-button-icon">
          <AnimatedIcon icon={home_icon} class_name="nocss" />
        </div>
        <span className="back-button-text">Back to Home</span>
        <div className="back-button-glow"></div>
      </button>

      <div className="blog-wall-title-section">
        <SectionHeading section_name="BLOG WALL" />
        <p className="blog-wall-catchphrase">
          Written end-to-end by a human. No AI rewriting, paraphrasing, or polishing.
        </p>
      </div>

      <div className="blog-wall-actions">
        <button 
          className="publish-button"
          onClick={handlePublishClick}
        >
          <div className="publish-button-glow"></div>
          <span className="publish-button-text">Publish a new blog</span>
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="blog-wall-empty">
          <p>No blogs available yet.</p>
        </div>
      ) : (
        <div className="blog-wall-grid">
          {blogs.map((blog) => (
            <BlogPostCard 
              key={blog.id} 
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <div className="blog-card-content">
                <h3 className="blog-card-title">
                  {blog.title || 'Untitled'}
                </h3>
                
                {blog.subtitle && (
                  <p className="blog-card-subtitle">
                    {blog.subtitle}
                  </p>
                )}
                
                <div className="blog-card-meta">
                  <span className="blog-card-meta-text">
                    {formatBlogDate(blog.createdAt)}
                  </span>
                </div>

                <div className="blog-card-stats">
                  <span className="blog-card-stats-text">
                    {blog.views || 0} views
                  </span>
                  {blog.timeToRead && (
                    <>
                      <span className="blog-card-separator">•</span>
                      <span className="blog-card-stats-text">
                        {blog.timeToRead}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </BlogPostCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogWall;

