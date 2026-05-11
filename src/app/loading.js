export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#081b29', // Default recruiter blue to match initial theme
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
    }}>
      <div className="pulse-logo" style={{
        fontFamily: 'Pacifico, cursive',
        fontSize: '3.5rem',
        color: '#00abf0',
        fontWeight: 'bold',
        animation: 'pulse 1.5s infinite ease-in-out'
      }}>
        Mudit.
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}