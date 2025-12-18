import React, { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { checkAuthorEmailExists } from '../../services/blogUtils';
import './AuthorVerificationModal.css';

const AuthorVerificationModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasSent, setHasSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasSent) {
      return; // Prevent duplicate sends
    }

    if (!email) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, check if the email exists in the authors collection
      const { exists, author } = await checkAuthorEmailExists(email);
      
      if (!exists) {
        setError('This email address is not registered as an author. Please contact the administrator.');
        setIsLoading(false);
        return;
      }

      // Configure action code settings
      const actionCodeSettings = {
        url: `${window.location.origin}/blogs/publish`,
        handleCodeInApp: true,
      };

      // Store email in localStorage (required by Firebase)
      window.localStorage.setItem('emailForSignIn', email);

      // Send sign-in link
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      setHasSent(true);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error sending sign-in link:', err);
      setError(err.message || 'Failed to send sign-in link. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user types
  };

  return (
    <div className="modal-content-base author-verification-modal">
      <div className="modal-header author-verification-header">
        <h2 className="modal-title author-verification-title">Author Verification</h2>
        <button 
          className="modal-close-button author-verification-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>

      <div className="author-verification-content">
        {!isSuccess ? (
          <>
            <p className="author-verification-instruction">
              To publish a blog, we need to verify your author identity. 
              Enter your email address below and we'll send you a sign-in link.
            </p>

            <form onSubmit={handleSubmit} className="modal-form author-verification-form">
              <div className="modal-field-group author-verification-input-group">
                <label htmlFor="author-email" className="modal-label author-verification-label">
                  Email Address
                </label>
                <input
                  id="author-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your.email@example.com"
                  className="modal-input author-verification-input"
                  disabled={isLoading || hasSent}
                  required
                />
              </div>

              {error && (
                <div className="modal-error author-verification-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="modal-button-primary author-verification-submit"
                disabled={isLoading || hasSent || !email}
              >
                {isLoading ? 'Sending...' : hasSent ? 'Link Sent' : 'Send Sign-In Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="author-verification-success">
            <div className="author-verification-success-icon">✓</div>
            <h3 className="author-verification-success-title">Check Your Email</h3>
            <p className="author-verification-success-message">
              We've sent a sign-in link to <strong>{email}</strong>. 
              Click the link in the email to continue with publishing your blog.
            </p>
            <p className="author-verification-success-note">
              The link will redirect you to the blog publishing page.
            </p>
            <button
              onClick={onClose}
              className="modal-button-secondary author-verification-close-button"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorVerificationModal;

