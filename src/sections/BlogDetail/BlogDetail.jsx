"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './BlogDetail.css';
import { fetchBlogById, getAuthorDisplayName, formatBlogDate, trackBlogView, isBlogLiked, toggleBlogLike, shareBlog } from '../../services/blogUtils';
import BackIcon from '../../assets/svg/BackIcon';
import HeartIcon from '../../assets/svg/HeartIcon';
import EyeIcon from '../../assets/svg/EyeIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import Toast from '../../components/Toast/Toast';
import Modal from '../../components/Modal/Modal';
import EditVerificationModal from '../../components/EditVerificationModal/EditVerificationModal';
import AddBlogModal from '../../components/AddBlogModal/AddBlogModal';
import BlogSectionNav from '../../components/BlogSectionNav/BlogSectionNav';

const MIN_PARAGRAPH_INDENT_CHARS = 120;

const BlogDetail = ({
  initialBlog = null,
  initialAuthor = null,
  initialPrevBlog = null,
  initialNextBlog = null,
  notFound = false,
}) => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(initialBlog);
  const [author, setAuthor] = useState(initialAuthor);
  const [error, setError] = useState(notFound ? 'Blog not found' : null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [prevBlog, setPrevBlog] = useState(initialPrevBlog);
  const [nextBlog, setNextBlog] = useState(initialNextBlog);
  const [showEditVerificationModal, setShowEditVerificationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const viewCountedRef = useRef(false);
  const headerRef = useRef(null);
  const headerSentinelRef = useRef(null);
  const maxHeaderOffsetRef = useRef(0);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [isHeaderPinned, setIsHeaderPinned] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLiked(isBlogLiked(id));
    }
  }, [id]);

  useEffect(() => {
    if (!id || !initialBlog) return;

    let cancelled = false;
    fetchBlogById(id)
      .then((freshBlog) => {
        if (cancelled || !freshBlog) return;
        setBlog((prev) => (
          prev ? { ...prev, views: freshBlog.views, likes: freshBlog.likes } : prev
        ));
      })
      .catch((err) => {
        console.error('Error refreshing blog stats:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [id, initialBlog]);

  useEffect(() => {
    const trackView = async () => {
      if (!id || viewCountedRef.current || error || !blog) return;

      try {
        const tracked = await trackBlogView(id);
        if (tracked) {
          setBlog((prev) => (
            prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
          ));
        }
        viewCountedRef.current = true;
      } catch (err) {
        console.error('Error tracking view:', err);
      }
    };

    if (blog && !viewCountedRef.current) {
      trackView();
    }
  }, [id, blog, error]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderOffset = () => {
      const height = header.offsetHeight;
      maxHeaderOffsetRef.current = Math.max(maxHeaderOffsetRef.current, height);
      const offset = maxHeaderOffsetRef.current;

      setHeaderOffset(offset);
      document.documentElement.style.setProperty('--blog-header-offset', `${offset}px`);
      document.documentElement.style.scrollPaddingTop = `${offset + 16}px`;
    };

    updateHeaderOffset();

    const resizeObserver = new ResizeObserver(updateHeaderOffset);
    resizeObserver.observe(header);

    const sentinel = headerSentinelRef.current;
    const pinObserver = sentinel
      ? new IntersectionObserver(
          ([entry]) => {
            setIsHeaderPinned(!entry.isIntersecting);
            requestAnimationFrame(updateHeaderOffset);
          },
          { threshold: 0 }
        )
      : null;

    if (sentinel && pinObserver) {
      pinObserver.observe(sentinel);
    }

    return () => {
      resizeObserver.disconnect();
      pinObserver?.disconnect();
      maxHeaderOffsetRef.current = 0;
      setHeaderOffset(0);
      document.documentElement.style.removeProperty('--blog-header-offset');
      document.documentElement.style.removeProperty('scroll-padding-top');
    };
  }, [blog]);

  const firstTextBlockIndex = blog?.content?.findIndex((block) => block.type === 'text') ?? -1;

  const sectionNavItems = blog?.content
    ?.map((block, index) =>
      block.type === 'subheading'
        ? { id: `blog-section-${index}`, label: block.value }
        : null
    )
    .filter(Boolean) ?? [];

  const handleToggleLike = useCallback(async () => {
    if (isLiking || blog?.likes == null) return;

    setIsLiking(true);
    const previousLiked = isLiked;
    const previousLikes = blog.likes || 0;

    setIsLiked(!previousLiked);
    setBlog((prev) => ({
      ...prev,
      likes: previousLiked ? previousLikes - 1 : previousLikes + 1,
    }));

    try {
      await toggleBlogLike(id);
    } catch (err) {
      console.error('Error toggling like:', err);
      setIsLiked(previousLiked);
      setBlog((prev) => ({
        ...prev,
        likes: previousLikes,
      }));
    } finally {
      setIsLiking(false);
    }
  }, [blog, id, isLiked, isLiking]);

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text': {
        const isLead = index === firstTextBlockIndex;
        const textLength = block.value?.length ?? 0;
        const shouldIndent = !isLead && textLength >= MIN_PARAGRAPH_INDENT_CHARS;
        const className = [
          'blog-content-text',
          isLead && 'blog-content-text--lead',
          shouldIndent && 'blog-content-text--indent',
        ].filter(Boolean).join(' ');

        return (
          <div key={index} className={className}>
            {isLead && textLength > 0 ? (
              <p>
                <span className="blog-drop-cap" aria-hidden="true">{block.value[0]}</span>
                {block.value.slice(1)}
              </p>
            ) : (
              <p>{block.value}</p>
            )}
          </div>
        );
      }

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

      case 'quote':
        return (
          <div key={index} className="blog-content-quote">
            <span className="blog-quote-mark">"</span>
            <span className="blog-quote-text">{block.value}</span>
          </div>
        );

      case 'subheading':
        return (
          <div key={index} id={`blog-section-${index}`} className="blog-content-subheading">
            <h2>{block.value}</h2>
            <span className="blog-subheading-rule" aria-hidden="true" />
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

  const handleEditClick = () => {
    setShowEditVerificationModal(true);
  };

  const handleEditVerificationSuccess = () => {
    setShowEditVerificationModal(false);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  if (error || !blog) {
    return (
      <div className="blog-detail">
        <div className="blog-detail-error">
          <p>{error || 'Blog not found'}</p>
          <button 
            className="back-button"
            onClick={() => router.push('/blogs')}
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
    <div className="blog-detail-page">
      {sectionNavItems.length > 0 && (
        <BlogSectionNav sections={sectionNavItems} headerOffset={headerOffset} />
      )}

      <div className="blog-detail">
      <button 
        className="back-button"
        onClick={() => router.push('/blogs')}
        title="Back to Blog Wall"
      >
        <div className="back-button-icon">
          <BackIcon />
        </div>
        <span className="back-button-text">Back to Blog Wall</span>
        <div className="back-button-glow"></div>
      </button>

      <article className="blog-detail-article">
        <div ref={headerSentinelRef} className="blog-header-sentinel" aria-hidden="true" />

        <header
          ref={headerRef}
          className={`blog-detail-header${isHeaderPinned ? ' is-pinned' : ''}`}
        >
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

          <div className="blog-detail-stats-row">
            <span className="blog-detail-date">
              {formatBlogDate(blog.createdAt, { year: 'numeric', month: 'long', day: 'numeric' }, true)}
            </span>
            <div className="blog-detail-stats">
              <div className="blog-stat-display">
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
                    onClick={handleToggleLike}
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
                  className="blog-edit-button"
                  onClick={handleEditClick}
                  title="Edit blog"
                >
                  <div className="blog-edit-icon">
                    ✏️
                  </div>
                </button>
              </div>
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

        <div className="blog-detail-tags-row">
          {blog.tags?.length > 0 && (
              <div className="blog-detail-tags">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="blog-detail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
        </div>
      </article>

      {/* Navigation buttons */}
      <div className="blog-navigation">
        {prevBlog && (
          <button
            className="blog-nav-button blog-nav-prev"
            onClick={() => router.push(`/blogs/${prevBlog.id}`)}
            title={`Previous: ${prevBlog.title}`}
          >
            <span className="blog-nav-arrow">←</span>
            <span className="blog-nav-title">{prevBlog.title}</span>
          </button>
        )}
        {nextBlog && (
          <button
            className="blog-nav-button blog-nav-next"
            onClick={() => router.push(`/blogs/${nextBlog.id}`)}
            title={`Next: ${nextBlog.title}`}
          >
            <span className="blog-nav-title">{nextBlog.title}</span>
            <span className="blog-nav-arrow">→</span>
          </button>
        )}
      </div>

      <Toast
        show={showToast}
        message="Link copied to clipboard!"
        onClose={() => setShowToast(false)}
      />

      {/* Edit Verification Modal */}
      <Modal
        isOpen={showEditVerificationModal}
        onClose={() => setShowEditVerificationModal(false)}
      >
        <EditVerificationModal
          onClose={() => setShowEditVerificationModal(false)}
          onSuccess={handleEditVerificationSuccess}
          authorId={author?.id}
          authorName={getAuthorDisplayName(author)}
        />
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
      >
        <AddBlogModal
          onClose={handleEditModalClose}
          editMode={true}
          blogData={blog}
        />
      </Modal>
      </div>
    </div>
  );
};

export default BlogDetail;