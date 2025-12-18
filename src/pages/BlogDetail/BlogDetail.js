import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';
import { fetchBlogById, fetchAuthorById, getAuthorId, getAuthorDisplayName, formatBlogDate, trackBlogView, isBlogLiked, toggleBlogLike, shareBlog } from '../../services/blogUtils';
import BackIcon from '../../assets/svg/BackIcon';
import HeartIcon from '../../assets/svg/HeartIcon';
import EyeIcon from '../../assets/svg/EyeIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Toast from '../../components/Toast/Toast';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const viewCountedRef = useRef(false);

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
          setIsLiked(isBlogLiked(id));
          
          const authorId = getAuthorId(fetchedBlog);
          if (authorId) {
            try {
              const fetchedAuthor = await fetchAuthorById(authorId);
              if (fetchedAuthor) setAuthor(fetchedAuthor);
            } catch (err) {}
          }
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

  useEffect(() => {
    const trackView = async () => {
      if (!id || viewCountedRef.current || loading || error) return;

      try {
        await trackBlogView(id);
        viewCountedRef.current = true;
      } catch (err) {
        console.error('Error tracking view:', err);
      }
    };

    if (blog && !viewCountedRef.current) {
      trackView();
    }
  }, [id, blog, loading, error]);

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

  const handleShare = async () => {
    try {
      await shareBlog(id);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to share blog:', err);
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
          <div className="blog-detail-title-author-row">
            <h1 className="blog-detail-title">
              {blog.title || 'Untitled'}
            </h1>
            {author && getAuthorDisplayName(author) && (
              <div className="blog-detail-author">
                <span className="blog-detail-author-label">By</span>
                <span className="blog-detail-author-name">{getAuthorDisplayName(author)}</span>
              </div>
            )}
          </div>

          <div className="blog-detail-tags-stats-row">
            {blog.tags?.length > 0 && (
              <div className="blog-detail-tags">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="blog-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="blog-detail-meta-stats">
              <span className="blog-detail-date-pill">
                {formatBlogDate(blog.createdAt, { year: 'numeric', month: 'long', day: 'numeric' }, true)}
              </span>
              <div className="blog-detail-stats">
                <div className="blog-stat-item">
                  <div className="blog-stat-icon" title="Views">
                    <EyeIcon />
                  </div>
                  <span className="blog-detail-stats-text">
                    {blog.views || 0}
                  </span>
                </div>
                {blog.likes != null && (
                  <div className="blog-stat-item">
                    <button
                      className={`blog-like-button ${isLiked ? 'liked' : ''}`}
                      onClick={async () => {
                        if (isLiking) return;
                        
                        setIsLiking(true);
                        const previousLiked = isLiked;
                        const previousLikes = blog.likes || 0;
                        
                        // Optimistic update
                        setIsLiked(!previousLiked);
                        setBlog(prev => ({
                          ...prev,
                          likes: previousLiked ? previousLikes - 1 : previousLikes + 1
                        }));
                        
                        try {
                          await toggleBlogLike(id);
                        } catch (err) {
                          console.error('Error toggling like:', err);
                          // Revert optimistic update on error
                          setIsLiked(previousLiked);
                          setBlog(prev => ({
                            ...prev,
                            likes: previousLikes
                          }));
                        } finally {
                          setIsLiking(false);
                        }
                      }}
                      disabled={isLiking}
                      title={isLiked ? 'Unlike this blog' : 'Like this blog'}
                    >
                      <div className="blog-like-icon">
                        <HeartIcon filled={isLiked} />
                      </div>
                    </button>
                    <span className="blog-detail-stats-text">
                      {blog.likes}
                    </span>
                  </div>
                )}
                <div className="blog-stat-item">
                  <button
                    className="blog-share-button"
                    onClick={handleShare}
                    title="Share blog"
                  >
                    <div className="blog-share-icon">
                      <ShareIcon />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {blog.timeToRead && (
          <div className="blog-detail-time-to-read">
            {blog.timeToRead} read
          </div>
        )}

        <div className="blog-detail-body">
          {blog.content?.length > 0 ? (
            blog.content.map((block, index) => renderContentBlock(block, index))
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </article>
      <Toast 
        show={showToast} 
        message="Link copied to clipboard!"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default BlogDetail;