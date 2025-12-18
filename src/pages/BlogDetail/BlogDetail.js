import React from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();

  return (
    <div className="blog-detail">
      <h1>Blog Post</h1>
      <p>Blog ID: {id}</p>
      <p>Blog content will be displayed here.</p>
    </div>
  );
};

export default BlogDetail;

