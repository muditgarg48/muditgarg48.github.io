import { memo } from 'react';
import './BotIntro.css';

export const BotIntroContent = memo(() => (
  <div className="bot-intro">
    <h2 className="bot-intro-title">Meet A.L.F.R.E.D.</h2>
    <p className="bot-intro-acronym">
      A Loyal Friend Ready to Enlighten Daily
    </p>
    <p className="bot-intro-description">
      He&apos;s my on-site assistant. Ask about my work, background, or projects —
      he pulls from what I&apos;ve shared here instead of making you hunt for it.
    </p>
    <p className="bot-intro-tech">
      Running on Gemini with a small RAG setup over my own notes and pages.
    </p>
  </div>
));
