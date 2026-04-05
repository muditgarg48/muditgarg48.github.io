import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogWall.css';
import { fetchAllBlogs, fetchAuthorById, getAuthorId, getAuthorDisplayName, formatBlogDate, isBlogLiked, shareBlog } from '../../services/blogUtils';
import BlogPostCard from './BlogPostCard';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import WebsiteLogo from '../../components/WebsiteLogo/WebsiteLogo';
import EyeIcon from '../../assets/svg/EyeIcon';
import HeartIcon from '../../assets/svg/HeartIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import Toast from '../../components/Toast/Toast';
import Modal from '../../components/Modal/Modal';
import AuthorVerificationModal from '../../components/AuthorVerificationModal/AuthorVerificationModal';
import AddBlogModal from '../../components/AddBlogModal/AddBlogModal';
import FilterBar from '../../components/FilterBar/FilterBar';
import useFiltering from '../../hooks/useFiltering';

const BlogWall = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showAuthorVerificationModal, setShowAuthorVerificationModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBlogs = await fetchAllBlogs();
        setBlogs(fetchedBlogs);
        
        const authorsMap = {};
        await Promise.all(fetchedBlogs.map(async (blog) => {
          const authorId = getAuthorId(blog);
          if (authorId) {
            try {
              const author = await fetchAuthorById(authorId);
              if (author) {
                authorsMap[blog.id] = author;
              }
            } catch (err) {
              console.error(`Error fetching author for blog ${blog.id}:`, err);
            }
          }
        }));
        setAuthors(authorsMap);
      } catch (err) {
        console.error('Error loading blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Check if we should open AddBlogModal after email verification
  useEffect(() => {
    const shouldOpenModal = sessionStorage.getItem('openAddBlogModal');
    if (shouldOpenModal === 'true') {
      setShowAddBlogModal(true);
      // Clear the flag so it doesn't open again on refresh
      sessionStorage.removeItem('openAddBlogModal');
    }
  }, []);

  const handlePublishClick = () => {
    setShowAuthorVerificationModal(true);
  };

  // 1. Data Enrichment for filtering
  const enrichedBlogs = useMemo(() => {
    return blogs.map(blog => {
      const author = authors[blog.id];
      const authorDisplayName = getAuthorDisplayName(author) || 'Unknown Author';
      // Format date specifically for search display/match
      const formattedDate = formatBlogDate(blog.createdAt, { year: 'numeric', month: 'short', day: 'numeric' }, false);
      
      return {
        ...blog,
        authorDisplayName,
        formattedDate,
        rawDate: blog.createdAt?.toDate ? blog.createdAt.toDate().getTime() : 
                 (blog.createdAt ? new Date(blog.createdAt).getTime() : 0)
      };
    });
  }, [blogs, authors]);

  // 2. Filter Configuration
  const filterOptions = useMemo(() => {
    const authorSet = new Set(['All']);
    enrichedBlogs.forEach(blog => {
      if (blog.authorDisplayName && blog.authorDisplayName !== 'Unknown Author') {
        authorSet.add(blog.authorDisplayName);
      }
    });
    return Array.from(authorSet);
  }, [enrichedBlogs]);

  const filteringConfig = useMemo(() => ({
    searchFields: ['title', 'authorDisplayName', 'subtitle', 'timeToRead', 'tags', 'formattedDate'],
    filterLogic: {
      'All': () => true,
      // Dynamic filters for each author
      ...filterOptions.reduce((acc, author) => {
        if (author !== 'All') {
          acc[author] = (blog) => blog.authorDisplayName === author;
        }
        return acc;
      }, {})
    },
    sortLogic: {
      'Newest': (a, b) => b.rawDate - a.rawDate,
      'Oldest': (a, b) => a.rawDate - b.rawDate,
      'Popular': (a, b) => (b.views || 0) - (a.views || 0),
      'Likes': (a, b) => (b.likes || 0) - (a.likes || 0),
      'Time to Read': (a, b) => {
        // Simple comparison of time strings (e.g. "5 min read")
        const getMinutes = (str) => parseInt(str) || 0;
        return getMinutes(a.timeToRead) - getMinutes(b.timeToRead);
      }
    }
  }), [filterOptions]);

  // 3. Hook Setup
  const {
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    filter, setFilter,
    filteredData
  } = useFiltering(enrichedBlogs, filteringConfig);

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
      <div className="blog-wall-title-section">
        <div className="blog-wall-integrated-heading">
          <div 
            className="blog-wall-logo-inline" 
            onClick={() => navigate('/')}
            title="Click to go home"
          >
            <WebsiteLogo />
          </div>
          <span className="blog-wall-heading-separator">|</span>
          <SectionHeading section_name="BLOG WALL" />
        </div>
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

      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={['Newest', 'Oldest', 'Popular', 'Likes', 'Time to Read']}
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        placeholder="Search blogs..."
      />

      {filteredData.length === 0 ? (
        <div className="blog-wall-empty">
          <p>{searchTerm || filter !== 'All' ? 'No blogs found matching your criteria.' : 'No blogs available yet.'}</p>
        </div>
      ) : (
        <div className="blog-wall-grid">
          {filteredData.map((blog) => (
            <BlogPostCard 
              key={blog.id} 
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <div className="blog-card-content">
                <div className="blog-card-title-author-row">
                  <h3 className="blog-card-title">
                    {blog.title || 'Untitled'}
                  </h3>
                  {authors[blog.id] && getAuthorDisplayName(authors[blog.id]) && (
                    <div className="blog-card-author">
                      <span className="blog-card-author-label">By</span>
                      <span className="blog-card-author-name">{getAuthorDisplayName(authors[blog.id])}</span>
                    </div>
                  )}
                </div>
                
                {blog.subtitle && (
                  <p className="blog-card-subtitle">
                    {blog.subtitle}
                  </p>
                )}

                {blog.timeToRead && (
                  <div className="blog-card-time-to-read">
                    {blog.timeToRead} read
                  </div>
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
      <Modal
        isOpen={showAuthorVerificationModal}
        onClose={() => setShowAuthorVerificationModal(false)}
      >
        <AuthorVerificationModal
          onClose={() => setShowAuthorVerificationModal(false)}
        />
      </Modal>
      <Modal
        isOpen={showAddBlogModal}
        onClose={() => setShowAddBlogModal(false)}
      >
        <AddBlogModal
          onClose={() => setShowAddBlogModal(false)}
        />
      </Modal>
    </div>
  );
};

export default BlogWall;