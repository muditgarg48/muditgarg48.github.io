import './Footer.css';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function Footer({ dataLastUpdated }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--font-secondary-color)', padding: '1rem' }}>
      <div id="footer">
        Powered By
        <hr id="footer-divider" />
        <div id="footer-icons">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="react" loading="lazy" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" alt="npm" loading="lazy" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="github" loading="lazy" />
        </div>
      </div>
      {dataLastUpdated && `Last Updated: ${formatDate(dataLastUpdated)}`}
    </div>
  );
}

export default Footer;