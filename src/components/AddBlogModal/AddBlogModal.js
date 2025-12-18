import React, { useState, useEffect } from 'react';
import { checkAuthorEmailExists } from '../../services/blogUtils';
import './AddBlogModal.css';

const AddBlogModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [timeToRead, setTimeToRead] = useState('');
  const [tags, setTags] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get verified author email from sessionStorage
    const verifiedEmail = sessionStorage.getItem('verifiedAuthorEmail');
    if (verifiedEmail) {
      setAuthorEmail(verifiedEmail);
      // Fetch author details to get display name
      const fetchAuthorInfo = async () => {
        try {
          const { author } = await checkAuthorEmailExists(verifiedEmail);
          if (author) {
            setAuthorName(author.displayName || verifiedEmail);
          } else {
            setAuthorName(verifiedEmail);
          }
        } catch (err) {
          console.error('Error fetching author info:', err);
          setAuthorName(verifiedEmail);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAuthorInfo();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement blog publishing logic
    console.log('Blog data:', {
      title,
      subtitle,
      timeToRead,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      authorEmail,
      authorName
    });
    alert('Blog publishing will be implemented later!');
  };

  if (isLoading) {
    return (
      <div className="add-blog-modal">
        <div className="add-blog-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="modal-content-base add-blog-modal">
      <div className="modal-header add-blog-header">
        <h2 className="modal-title add-blog-title">Add New Blog</h2>
        <button 
          className="modal-close-button add-blog-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form add-blog-form">
        <div className="modal-field-group add-blog-field-group">
          <label htmlFor="blog-author" className="modal-label add-blog-label">
            Author
          </label>
          <input
            id="blog-author"
            type="text"
            value={authorName || authorEmail}
            className="modal-input add-blog-input add-blog-input-disabled"
            disabled
            readOnly
          />
          <p className="modal-field-note add-blog-field-note">Author is automatically detected from your verified email.</p>
        </div>

        <div className="modal-field-group add-blog-field-group">
          <label htmlFor="blog-title" className="modal-label add-blog-label">
            Title <span className="add-blog-required">*</span>
          </label>
          <input
            id="blog-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            className="modal-input add-blog-input"
            required
          />
        </div>

        <div className="modal-field-group add-blog-field-group">
          <label htmlFor="blog-subtitle" className="modal-label add-blog-label">
            Subtitle
          </label>
          <input
            id="blog-subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter blog subtitle (optional)"
            className="modal-input add-blog-input"
          />
        </div>

        <div className="modal-field-group add-blog-field-group">
          <label htmlFor="blog-time-to-read" className="modal-label add-blog-label">
            Time to Read
          </label>
          <input
            id="blog-time-to-read"
            type="text"
            value={timeToRead}
            onChange={(e) => setTimeToRead(e.target.value)}
            placeholder="e.g., 5 min"
            className="modal-input add-blog-input"
          />
        </div>

        <div className="modal-field-group add-blog-field-group">
          <label htmlFor="blog-tags" className="modal-label add-blog-label">
            Tags
          </label>
          <input
            id="blog-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas (e.g., React, JavaScript, Web Development)"
            className="modal-input add-blog-input"
          />
          <p className="modal-field-note add-blog-field-note">Separate multiple tags with commas.</p>
        </div>

        <div className="modal-field-group add-blog-field-group">
          <label className="modal-label add-blog-label">
            Content
          </label>
          <div className="add-blog-content-placeholder">
            <p className="add-blog-placeholder-text">
              Content editor will be implemented in the next phase.
            </p>
            <p className="add-blog-placeholder-text">
              You'll be able to add text paragraphs, images, code blocks, and links.
            </p>
          </div>
        </div>

        <div className="add-blog-actions">
          <button
            type="button"
            onClick={onClose}
            className="modal-button-secondary add-blog-cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="modal-button-primary add-blog-submit-button"
            disabled={!title.trim()}
          >
            Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogModal;

