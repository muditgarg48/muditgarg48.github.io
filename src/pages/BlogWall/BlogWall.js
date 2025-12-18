import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogWall.css';
import { fetchAllBlogs, formatBlogDate, isBlogLiked, shareBlog } from '../../services/blogUtils';
import BlogPostCard from './BlogPostCard';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import AnimatedIcon from '../../components/AnimatedIcon/AnimatedIcon';
import EyeIcon from '../../assets/svg/EyeIcon';
import HeartIcon from '../../assets/svg/HeartIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Toast from '../../components/Toast/Toast';

const home_icon = require('../../assets/icons/home.json');

const BlogWall = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

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
  };

  const handleShare = async (e, blogId) => {
    e.stopPropagation(); // Prevent card click navigation
    
    try {
      await shareBlog(blogId);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to share blog:', err);
    }
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

                <div className="blog-card-tags-stats-row">
                  {blog.tags?.length > 0 && (
                    <div className="blog-card-tags">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="blog-card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="blog-card-meta-stats">
                    <span className="blog-card-date-pill">
                      {formatBlogDate(blog.createdAt)}
                    </span>
                    <div className="blog-card-stats">
                      <div className="blog-card-stat-item">
                        <div className="blog-card-stat-icon" title="Views">
                          <EyeIcon />
                        </div>
                        <span className="blog-card-stats-text">
                          {blog.views || 0}
                        </span>
                      </div>
                      {blog.likes != null && (
                        <div className={`blog-card-stat-item ${isBlogLiked(blog.id) ? 'liked' : ''}`}>
                          <div className="blog-card-like-icon" title="Likes">
                            <HeartIcon filled={isBlogLiked(blog.id)} />
                          </div>
                          <span className="blog-card-stats-text">
                            {blog.likes}
                          </span>
                        </div>
                      )}
                      <div className="blog-card-stat-item">
                        <button
                          className="blog-card-share-button"
                          onClick={(e) => handleShare(e, blog.id)}
                          title="Share blog"
                        >
                          <div className="blog-card-share-icon">
                            <ShareIcon />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BlogPostCard>
          ))}
        </div>
      )}
      <Toast 
        show={showToast} 
        message="Link copied to clipboard!"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default BlogWall;

