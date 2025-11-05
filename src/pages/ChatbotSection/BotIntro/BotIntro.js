import React, { memo } from 'react';
import './BotIntro.css';

export const BotIntroContent = memo(() => (
  <div className="bot-intro-modal-body">
    <div className="bot-intro-modal-header">
      <h2 className="bot-intro-title">Meet A.L.F.R.E.D.</h2>
      <p className="bot-intro-acronym"> 
        <strong>A</strong> <strong>L</strong>oyal <strong>F</strong>riend <strong>R</strong>eady to <strong>E</strong>nlighten <strong>D</strong>aily.
      </p>
      <p className="bot-intro-patent">
        Patent pending.
      </p>
    </div>
    <div className="bot-intro-modal-body-content">
      <p className="bot-intro-description">
        A.L.F.R.E.D. is my personal AI assistant on this website, ready to answer your questions about me in real time. 😂
      </p>
      <div className="bot-intro-tech">
        <p className="bot-intro-tech-label">Technical Details:</p>
        <p>
          A <strong>Retrieval Augmented Generation (RAG)</strong> chatbot powered by <strong>Gemini 2.5 Flash</strong> for natural language answers, <strong>FAISS</strong> for vector embedding storage, and <strong>FastEmbed</strong> for vector embedding generation. Trained on my personal data to answer questions about me without exploring the entire website.
        </p>
      </div>
      <p className="bot-intro-cta">
        Ask Away! 🚀
      </p>
    </div>
  </div>
));

