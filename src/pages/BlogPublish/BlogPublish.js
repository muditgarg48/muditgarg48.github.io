import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../../services/firebase';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import './BlogPublish.css';

const BlogPublish = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleEmailLinkAuth = async () => {
      try {
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setError('Invalid sign-in link. Please request a new link.');
          setLoading(false);
          return;
        }

        const email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          setError('Please enter your email address to complete sign-in.');
          setLoading(false);
          return;
        }

        await signInWithEmailLink(auth, email, window.location.href);
        
        window.localStorage.removeItem('emailForSignIn');
        sessionStorage.setItem('openAddBlogModal', 'true');
        sessionStorage.setItem('verifiedAuthorEmail', email);

        navigate('/blogs');
      } catch (err) {
        console.error('Error completing sign-in:', err);
        setError(err.message || 'Failed to verify your email. Please try again.');
        setLoading(false);
      }
    };

    handleEmailLinkAuth();
  }, [navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="blog-publish">
        <div className="blog-publish-error">
          <h2>Verification Failed</h2>
          <p>{error}</p>
          <button 
            className="modal-button-primary blog-publish-back-button"
            onClick={() => navigate('/blogs')}
          >
            Back to Blog Wall
          </button>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
};

export default BlogPublish;

