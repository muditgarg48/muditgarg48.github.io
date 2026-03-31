import React, { useState, useEffect } from 'react';
import { checkAuthorEmailExists, createBlog, updateBlog, deleteBlog } from '../../services/blogUtils';
import { processBlogContent } from '../../services/firebaseUtils';
import ContentEditor from '../ContentEditor/ContentEditor';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './AddBlogModal.css';

const CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  CODE: 'code',
  LINK: 'link',
  QUOTE: 'quote'
};

const AddBlogModal = ({ onClose, editMode = false, blogData = null }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [timeToRead, setTimeToRead] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState([]);
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Content editor state
  const [contentType, setContentType] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [codeTitle, setCodeTitle] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeValue, setCodeValue] = useState('');
  const [linkPlaceholder, setLinkPlaceholder] = useState('');
  const [linkValue, setLinkValue] = useState('');
  const [quoteValue, setQuoteValue] = useState('');
  const [editingContentIndex, setEditingContentIndex] = useState(null);

  useEffect(() => {
    // Get verified author email from sessionStorage
    const verifiedEmail = sessionStorage.getItem('verifiedAuthorEmail');
    if (verifiedEmail) {
      setAuthorEmail(verifiedEmail);
      // Fetch author details to get display name and set authorId
      const fetchAuthorInfo = async () => {
        try {
          const { author } = await checkAuthorEmailExists(verifiedEmail);
          if (author) {
            setAuthorName(author.display_name || verifiedEmail);
            setAuthorId(author.id); // Author ID is the email
          } else {
            setAuthorName(verifiedEmail);
            setAuthorId(verifiedEmail); // Use email as authorId if author doesn't exist
          }
        } catch (err) {
          console.error('Error fetching author info:', err);
          setAuthorName(verifiedEmail);
          setAuthorId(verifiedEmail);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAuthorInfo();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Populate form with blog data in edit mode
  useEffect(() => {
    const populateEditData = async () => {
      if (editMode && blogData) {
        setTitle(blogData.title || '');
        setSubtitle(blogData.subtitle || '');
        setTimeToRead(blogData.timeToRead || '');
        setTags(blogData.tags ? blogData.tags.join(', ') : '');
        setContent(blogData.content || []);

        // Populate author information from blogData if available
        if (blogData.authorId) {
          setAuthorId(blogData.authorId);
          setAuthorEmail(blogData.authorId); // Assuming authorId is the email

          // Fetch author details to get display name
          try {
            const { author } = await checkAuthorEmailExists(blogData.authorId);
            if (author) {
              setAuthorName(author.display_name || blogData.authorId);
            } else {
              setAuthorName(blogData.authorId);
            }
          } catch (err) {
            console.error('Error fetching author info for edit mode:', err);
            setAuthorName(blogData.authorId);
          }
        }
      }
    };

    populateEditData();
  }, [editMode, blogData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndCreateContentData = () => {
    switch (contentType) {
      case CONTENT_TYPES.TEXT:
        if (!textValue.trim()) {
          alert('Please enter text content');
          return null;
        }
        return {
          type: 'text',
          value: textValue.trim()
        };

      case CONTENT_TYPES.IMAGE:
        if (!imageFile) {
          alert('Please select an image file');
          return null;
        }
        return {
          type: 'image',
          file: imageFile,
          preview: imagePreview
        };

      case CONTENT_TYPES.CODE:
        if (!codeValue.trim()) {
          alert('Please enter code content');
          return null;
        }
        return {
          type: 'code',
          language: codeLanguage,
          title: codeTitle.trim() || 'Code Snippet',
          value: codeValue.trim()
        };

      case CONTENT_TYPES.LINK:
        if (!linkPlaceholder.trim() || !linkValue.trim()) {
          alert('Please enter both link text and URL');
          return null;
        }
        let normalizedUrl = linkValue.trim();
        if (!normalizedUrl.match(/^https?:\/\//i)) {
          normalizedUrl = `https://${normalizedUrl}`;
        }
        try {
          new URL(normalizedUrl);
        } catch {
          alert('Please enter a valid URL');
          return null;
        }
        return {
          type: 'link',
          placeholder: linkPlaceholder.trim(),
          value: normalizedUrl
        };

      case CONTENT_TYPES.QUOTE:
        if (!quoteValue.trim()) {
          alert('Please enter quote content');
          return null;
        }
        return {
          type: 'quote',
          value: quoteValue.trim()
        };

      default:
        return null;
    }
  };

  const handleAddContent = (e) => {
    e.preventDefault();
    const contentData = validateAndCreateContentData();
    if (!contentData) return;

    if (editingContentIndex !== null) {
      // Update existing content
      const newContent = [...content];
      newContent[editingContentIndex] = contentData;
      setContent(newContent);
    } else {
      // Add new content
      const newContent = [...content, contentData];
      setContent(newContent);
    }
    resetContentForm();
  };

  const resetContentForm = () => {
    setContentType(null);
    setTextValue('');
    setImageFile(null);
    setImagePreview(null);
    setCodeTitle('');
    setCodeLanguage('javascript');
    setCodeValue('');
    setLinkPlaceholder('');
    setLinkValue('');
    setQuoteValue('');
    setEditingContentIndex(null);
  };

  const handleEditContent = (index) => {
    const contentItem = content[index];
    setEditingContentIndex(index);
    setContentType(contentItem.type);

    switch (contentItem.type) {
      case 'text':
        setTextValue(contentItem.value);
        break;
      case 'image':
        setImageFile(contentItem.file || null);
        setImagePreview(contentItem.preview || null);
        break;
      case 'code':
        setCodeTitle(contentItem.title || '');
        setCodeLanguage(contentItem.language || 'javascript');
        setCodeValue(contentItem.value);
        break;
      case 'link':
        setLinkPlaceholder(contentItem.placeholder);
        setLinkValue(contentItem.value);
        break;
      case 'quote':
        setQuoteValue(contentItem.value);
        break;
      default:
        break;
    }
  };

  const handleDeleteBlog = async () => {
    if (!editMode || !blogData) return;
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    setIsPublishing(true);

    try {
      await deleteBlog(blogData.id);
      alert('Blog deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert(`Error deleting blog: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a blog title');
      return;
    }

    if (!content || content.length === 0) {
      alert('Please add at least one content block');
      return;
    }

    if (!authorId) {
      alert('Author information is missing. Please verify your email first.');
      return;
    }

    setIsPublishing(true);

    try {
      // Prepare tags array
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      if (editMode && blogData) {
        // Update existing blog
        await updateBlog(blogData.id, {
          title: title.trim(),
          subtitle: subtitle ? subtitle.trim() : '',
          timeToRead: timeToRead ? timeToRead.trim() : '',
          tags: tagsArray,
          content: content
        });

        // Success - close modal
        alert('Blog updated successfully!');
        onClose();
      } else {
        // Create new blog
        // Generate blog ID: authorId_timestamp
        // Sanitize authorId to ensure valid Firestore document ID
        const sanitizedAuthorId = authorId.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = Date.now();
        const blogId = `${sanitizedAuthorId}_${timestamp}`;

        // Process content: upload images and transform to Firestore format
        const validContent = await processBlogContent(content, authorId, blogId);

        // Create blog document
        await createBlog({
          id: blogId,
          authorId: authorId,
          title: title.trim(),
          subtitle: subtitle ? subtitle.trim() : '',
          timeToRead: timeToRead ? timeToRead.trim() : '',
          tags: tagsArray,
          content: validContent
        });

        // Success - close modal and reset form
        alert('Blog published successfully!');
        onClose();

        // Reset form
        setTitle('');
        setSubtitle('');
        setTimeToRead('');
        setTags('');
        setContent([]);
        resetContentForm();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert(`Error saving blog: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="add-blog-modal">
        <div className="add-blog-loading">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="modal-content-base add-blog-modal">
      <div className="modal-header add-blog-header">
        <h2 className="modal-title add-blog-title">{editMode ? 'Edit Your Blog' : 'Add New Blog'}</h2>
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
          <ContentEditor content={content} onChange={setContent} onEditContent={handleEditContent} />
          
          <div className="add-blog-content-form">
            <div className="add-content-type-selector">
              <h3 className="add-content-type-title">Select Content Type</h3>
              <div className="add-content-type-grid">
                <button
                  type="button"
                  className={`add-content-type-option ${contentType === CONTENT_TYPES.TEXT ? 'selected' : ''}`}
                  onClick={() => setContentType(CONTENT_TYPES.TEXT)}
                >
                  <span className="add-content-type-icon">📝</span>
                  <span className="add-content-type-label">Text</span>
                </button>
                <button
                  type="button"
                  className={`add-content-type-option ${contentType === CONTENT_TYPES.IMAGE ? 'selected' : ''}`}
                  onClick={() => setContentType(CONTENT_TYPES.IMAGE)}
                >
                  <span className="add-content-type-icon">🖼️</span>
                  <span className="add-content-type-label">Image</span>
                </button>
                <button
                  type="button"
                  className={`add-content-type-option ${contentType === CONTENT_TYPES.CODE ? 'selected' : ''}`}
                  onClick={() => setContentType(CONTENT_TYPES.CODE)}
                >
                  <span className="add-content-type-icon">💻</span>
                  <span className="add-content-type-label">Code</span>
                </button>
                <button
                  type="button"
                  className={`add-content-type-option ${contentType === CONTENT_TYPES.LINK ? 'selected' : ''}`}
                  onClick={() => setContentType(CONTENT_TYPES.LINK)}
                >
                  <span className="add-content-type-icon">🔗</span>
                  <span className="add-content-type-label">Link</span>
                </button>
                <button
                  type="button"
                  className={`add-content-type-option ${contentType === CONTENT_TYPES.QUOTE ? 'selected' : ''}`}
                  onClick={() => setContentType(CONTENT_TYPES.QUOTE)}
                >
                  <span className="add-content-type-icon">💬</span>
                  <span className="add-content-type-label">Quote</span>
                </button>
              </div>
            </div>

            {contentType && (
              <>
                <div className="add-content-form-divider"></div>
                {contentType === CONTENT_TYPES.TEXT && (
                  <div className="modal-field-group">
                    <label htmlFor="text-content" className="modal-label">
                      Text Content <span className="add-blog-required">*</span>
                    </label>
                    <textarea
                      id="text-content"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Enter your text content..."
                      className="modal-input modal-textarea"
                      rows="6"
                    />
                  </div>
                )}

                {contentType === CONTENT_TYPES.IMAGE && (
                  <div className="modal-field-group">
                    <label htmlFor="image-file" className="modal-label">
                      Image File <span className="add-blog-required">*</span>
                    </label>
                    <input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="modal-input modal-file-input"
                    />
                    {imagePreview && (
                      <div className="add-content-image-preview">
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                    <p className="modal-field-note">Supported formats: JPG, PNG, GIF, WebP</p>
                  </div>
                )}

                {contentType === CONTENT_TYPES.CODE && (
                  <>
                    <div className="modal-field-group">
                      <label htmlFor="code-title" className="modal-label">
                        Code Snippet Title
                      </label>
                      <input
                        id="code-title"
                        type="text"
                        value={codeTitle}
                        onChange={(e) => setCodeTitle(e.target.value)}
                        placeholder="e.g., Example Function"
                        className="modal-input"
                      />
                    </div>
                    <div className="modal-field-group">
                      <label htmlFor="code-language" className="modal-label">
                        Programming Language
                      </label>
                      <select
                        id="code-language"
                        value={codeLanguage}
                        onChange={(e) => setCodeLanguage(e.target.value)}
                        className="modal-input"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="c">C</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="bash">Bash</option>
                        <option value="sql">SQL</option>
                        <option value="plaintext">Plain Text</option>
                      </select>
                    </div>
                    <div className="modal-field-group">
                      <label htmlFor="code-content" className="modal-label">
                        Code Content <span className="add-blog-required">*</span>
                      </label>
                      <textarea
                        id="code-content"
                        value={codeValue}
                        onChange={(e) => setCodeValue(e.target.value)}
                        placeholder="Enter your code..."
                        className="modal-input modal-textarea modal-code-textarea"
                        rows="10"
                      />
                    </div>
                  </>
                )}

                {contentType === CONTENT_TYPES.LINK && (
                  <>
                    <div className="modal-field-group">
                      <label htmlFor="link-placeholder" className="modal-label">
                        Link Text <span className="add-blog-required">*</span>
                      </label>
                      <input
                        id="link-placeholder"
                        type="text"
                        value={linkPlaceholder}
                        onChange={(e) => setLinkPlaceholder(e.target.value)}
                        placeholder="e.g., Visit my website"
                        className="modal-input"
                      />
                    </div>
                    <div className="modal-field-group">
                      <label htmlFor="link-value" className="modal-label">
                        URL <span className="add-blog-required">*</span>
                      </label>
                      <input
                        id="link-value"
                        type="url"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        placeholder="https://example.com"
                        className="modal-input"
                      />
                    </div>
                  </>
                )}

                {contentType === CONTENT_TYPES.QUOTE && (
                  <div className="modal-field-group">
                    <label htmlFor="quote-content" className="modal-label">
                      Quote Content <span className="add-blog-required">*</span>
                    </label>
                    <textarea
                      id="quote-content"
                      value={quoteValue}
                      onChange={(e) => setQuoteValue(e.target.value)}
                      placeholder="Enter your quote..."
                      className="modal-input modal-textarea"
                      rows="4"
                    />
                  </div>
                )}

                <div className="add-content-actions">
                  <button
                    type="button"
                    onClick={resetContentForm}
                    className="modal-button-secondary"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleAddContent}
                    className="modal-button-primary"
                  >
                    {editingContentIndex !== null ? 'Update Content' : 'Add Content'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="add-blog-actions">
          {editMode && (
            <button
              type="button"
              onClick={handleDeleteBlog}
              className="modal-button-danger add-blog-delete-button"
              disabled={isPublishing}
            >
              {isPublishing ? 'Deleting...' : 'Delete Blog'}
            </button>
          )}
          <div className="add-blog-actions-right">
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
              disabled={!title.trim() || isPublishing || content.length === 0}
            >
              {isPublishing ? (editMode ? 'Updating...' : 'Publishing...') : (editMode ? 'Update Blog' : 'Publish Blog')}
            </button>
          </div>
        </div>
      </form>
    </div>

    {showDeleteConfirmation && (
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        blogTitle={blogData?.title || ''}
      />
    )}
  </>
  );
};

export default AddBlogModal;