import React from 'react';
import './BlogPostCard.css';

const BlogPostCard = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`blog-post-card ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default BlogPostCard;

