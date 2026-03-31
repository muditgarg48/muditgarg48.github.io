import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Footer.css';

function Footer() {

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  // const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [dataLastUpdated, setDataLastUpdated] = useState(Date.now());

  useEffect(()=> {
    // axios.get("https://api.github.com/repos/muditgarg48/muditgarg48.github.io/branches/master")
    //   .then(response => response.data)
    //   .then(data => {
    //     setLastUpdated(data.commit.commit.committer.date)
    //   })
    axios.get("https://api.github.com/repos/muditgarg48/portfolio_data/branches/master")
      .then(response => response.data)
      .then(data => {
        setDataLastUpdated(data.commit.commit.committer.date)
      })
  }, []);

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
        {/* Last Updated: {formatDate(lastUpdated)}
        <br/>
        Data Last Updated:{formatDate(dataLastUpdated)} */}
        Last Updated: {formatDate(dataLastUpdated)}
    </div>
  )
}

export default Footer;