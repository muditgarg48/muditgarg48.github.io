import React, { useState, useEffect } from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, blogTitle }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
      setIsConfirmEnabled(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsConfirmEnabled(confirmationText.trim() === blogTitle.trim());
  }, [confirmationText, blogTitle]);

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isConfirmEnabled) {
      handleConfirm();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-overlay" onClick={handleOverlayClick}>
      <div className="delete-confirmation-modal">
        <div className="delete-confirmation-header">
          <h2 className="delete-confirmation-title">Confirm Deletion</h2>
          <button
            className="delete-confirmation-close"
            onClick={onClose}
            aria-label="Close confirmation modal"
          >
            ×
          </button>
        </div>

        <div className="delete-confirmation-content">
          <div className="delete-confirmation-warning">
            <p className="delete-confirmation-message">
              ⚠️ This action cannot be undone. The blog will be permanently deleted.
            </p>
          </div>

          <div className="delete-confirmation-title-display">
            <label className="delete-confirmation-label">Blog Title:</label>
            <div className="delete-confirmation-title-text">
              {blogTitle}
            </div>
          </div>

          <div className="delete-confirmation-input-group">
            <label htmlFor="delete-confirmation-input" className="delete-confirmation-label">
              Type the exact blog title to confirm deletion:
            </label>
            <input
              id="delete-confirmation-input"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type the blog title here..."
              className="delete-confirmation-input"
              autoFocus
            />
            <p className="delete-confirmation-note">
              This helps prevent accidental deletions.
            </p>
          </div>
        </div>

        <div className="delete-confirmation-actions">
          <button
            className="delete-confirmation-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`delete-confirmation-confirm ${!isConfirmEnabled ? 'disabled' : ''}`}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            Delete Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
