import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Footer.css';

function Footer() {

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [dataLastUpdated, setDataLastUpdated] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(()=> {
    setIsHydrated(true);
    axios.get("https://api.github.com/repos/muditgarg48/portfolio_data/branches/master")
      .then(response => response.data)
      .then(data => {
        setDataLastUpdated(data.commit.commit.committer.date)
      })
      .catch(() => {
        // Fallback if API fails
        setDataLastUpdated(new Date().toISOString());
      });
  }, []);

  if (!isHydrated) return null;

  return (
    <div style={{display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", color: "var(--font-secondary-color)", padding: "1rem"}}>
        <div id="footer">
            Powered By
            <hr id="footer-divider"/>
            <div id="footer-icons">
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="react"/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" alt="npm"/>
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="github"/>
            </div>
        </div>
        {dataLastUpdated && `Last Updated: ${formatDate(dataLastUpdated)}`}
    </div>
  )
}

export default Footer;