import React, { useState } from 'react';
import { fetchAuthorById } from '../../services/blogUtils';
import EyeIcon from '../../assets/svg/EyeIcon';
import './EditVerificationModal.css';

const EditVerificationModal = ({ onClose, onSuccess, authorId, authorName }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter the edit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Fetch author details to get the edit_secret_code
      const author = await fetchAuthorById(authorId);

      if (!author) {
        setError('Author not found');
        setIsLoading(false);
        return;
      }

      if (!author.edit_secret_code) {
        setError('Edit code not set for this author. Please contact the administrator.');
        setIsLoading(false);
        return;
      }

      if (code.trim() === author.edit_secret_code) {
        // Code is correct, call success callback
        onSuccess();
        onClose();
      } else {
        setError('Incorrect edit code. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying edit code:', err);
      setError('Failed to verify edit code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setError(''); // Clear error when user types
  };

  return (
    <div className="modal-content-base edit-verification-modal">
      <div className="modal-header edit-verification-header">
        <h2 className="modal-title edit-verification-title">Edit Blog</h2>
        <button
          className="modal-close-button edit-verification-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>

      <div className="edit-verification-content">
        <p className="edit-verification-instruction">
          Hey <strong>{authorName || 'there'}</strong>, to edit your blog, please enter your edit secret code.
        </p>

        <form onSubmit={handleSubmit} className="modal-form edit-verification-form">
          <div className="modal-field-group edit-verification-input-group">
            <label htmlFor="edit-code" className="modal-label edit-verification-label">
              Edit Code
            </label>
            <div className="edit-verification-input-container">
              <input
                id="edit-code"
                type={showPassword ? "text" : "password"}
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter edit code"
                className="modal-input edit-verification-input"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="edit-verification-eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                <EyeIcon />
              </button>
            </div>
          </div>

          {error && (
            <div className="modal-error edit-verification-error">
              {error}
            </div>
          )}

          <div className="edit-verification-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-button-secondary edit-verification-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button-primary edit-verification-submit"
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? 'Verifying...' : 'Verify & Edit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVerificationModal;
