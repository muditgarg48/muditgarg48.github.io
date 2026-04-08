import React from 'react';
import './WebsiteLogo.css';

function WebsiteLogo({ className = "", style = {} }) {
  return (
    <div className={`website_logo ${className}`} style={style}>
        <span className="highlight_text">M</span>udit<span className="highlight_text">.</span>
    </div>
  )
}

export default WebsiteLogo;