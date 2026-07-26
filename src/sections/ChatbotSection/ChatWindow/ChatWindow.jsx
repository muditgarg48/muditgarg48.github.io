import React, { useState, useCallback, memo } from 'react';
import './ChatWindow.css';
import { BotIntroContent } from '../BotIntro/BotIntro';
import InfoIcon from '../../../assets/svg/InfoIcon';
import SendIcon from '../../../assets/svg/SendIcon';
import LoadingLogo from '../../../components/LoadingLogo/LoadingLogo';
import WebsiteLogo from '../../../components/WebsiteLogo/WebsiteLogo';

const STATUS_TEXT = {
  online: 'Online',
  offline: 'Offline',
  waiting: 'Waiting'
};

const ALFRED_WAKEUP_MESSAGES = [
  "ALFRED is waking up...",
  "Connecting to server...",
  "Powering up AI modules...",
  "Initializing context..."
];

const getStatusText = (status) => STATUS_TEXT[status] || STATUS_TEXT.waiting;

const handleTrafficKeyDown = (event, action) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action?.();
  }
};

const ChatInactive = memo(() => (
  <div id="chat-inactive">
    A.L.F.R.E.D. currently in hibernation.
  </div>
));

const MessageBubble = memo(({ chat }) => {
  const shouldShowSources = chat.person === 'bot' && chat.sources?.length > 0;

  return (
    <div className={`message-row ${chat.person}-container`}>
      <div className={`${chat.person}-message`}>
        {chat.message}
        {shouldShowSources && (
          <div className="context-sources">
            <span className="context-sources-label">From</span>
            <span className="context-sources-list">{chat.sources.join(' · ')}</span>
          </div>
        )}
      </div>
    </div>
  );
});

const ChatHistory = memo(({ chatHistory, botEndRef }) => (
  <div id="chat-history">
    {chatHistory.map((chat, index) => (
      <MessageBubble
        key={`${chat.person}-${index}-${chat.message.substring(0, 20)}`}
        chat={chat}
      />
    ))}
    <div ref={botEndRef} />
  </div>
));

const ChatWindow = ({
  query,
  setQuery,
  chatHistory,
  chatActive,
  botStatus,
  botEndRef,
  handleSubmit,
  resetChat,
  onMinimize,
  onClose,
}) => {
  const [isInfoOverlayOpen, setIsInfoOverlayOpen] = useState(false);

  const handleResetChat = useCallback(() => {
    resetChat();
  }, [resetChat]);

  const toggleInfoOverlay = useCallback(() => {
    setIsInfoOverlayOpen(prev => !prev);
  }, []);

  const closeInfoOverlay = useCallback(() => {
    setIsInfoOverlayOpen(false);
  }, []);

  const canClear = chatActive && chatHistory.length > 0;

  return (
    <div id="chat-window">
      <div className="alfred-watermark" aria-hidden="true">
        <WebsiteLogo className="alfred-watermark-logo" />
      </div>
      <header id="window-titlebar">
        <div className="titlebar-header">
          <div id="control-buttons" className="traffic-lights">
            {onClose && (
              <button
                type="button"
                id="close-button"
                className="traffic-light"
                onClick={onClose}
                onKeyDown={(e) => handleTrafficKeyDown(e, onClose)}
                title="Close"
                aria-label="Close A.L.F.R.E.D. and clear chat"
              />
            )}
            {onMinimize && (
              <button
                type="button"
                id="minimize-button"
                className="traffic-light"
                onClick={onMinimize}
                onKeyDown={(e) => handleTrafficKeyDown(e, onMinimize)}
                title="Minimize"
                aria-label="Minimize A.L.F.R.E.D."
              />
            )}
          </div>
          <div id="window-title">
            <span className="title-text" aria-label="A.L.F.R.E.D.">
              <span className="title-mark">A</span>
              <span className="title-rest">LFRED</span>
            </span>
            <div id="bot-status" className={`status-${botStatus}`} title={getStatusText(botStatus)}>
              <span className="status-dot" aria-hidden="true" />
              <span className="status-text">{getStatusText(botStatus)}</span>
            </div>
          </div>
          <div id="titlebar-right">
            <button
              type="button"
              id="info-toggle-button"
              onClick={toggleInfoOverlay}
              className={isInfoOverlayOpen ? 'active' : ''}
              title={isInfoOverlayOpen ? 'Hide A.L.F.R.E.D. info' : 'Show A.L.F.R.E.D. info'}
              aria-pressed={isInfoOverlayOpen}
            >
              <InfoIcon />
            </button>
          </div>
        </div>
      </header>

      <div className={`info-overlay ${isInfoOverlayOpen ? 'open' : ''}`}>
        <div className="info-overlay-content">
          <BotIntroContent />
        </div>
      </div>

      <div className="chat-area-container" onClick={closeInfoOverlay}>
        {chatActive ? (
          <ChatHistory
            chatHistory={chatHistory}
            botEndRef={botEndRef}
          />
        ) : (
          <div className="chat-empty-state">
            {botStatus === 'waiting' ? (
              <LoadingLogo isMajor={true} textArray={ALFRED_WAKEUP_MESSAGES} />
            ) : (
              <ChatInactive />
            )}
          </div>
        )}
      </div>

      <div className="message-input-container" onClick={closeInfoOverlay}>
        {canClear && (
          <button
            type="button"
            id="clear-chat-button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetChat();
            }}
            title="Clear chat"
          >
            Clear chat
          </button>
        )}
        <form
          onSubmit={handleSubmit}
          id="message-input"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={closeInfoOverlay}
            placeholder="Type a message..."
            aria-label="Message A.L.F.R.E.D."
          />
          <button type="submit" id="send-button" disabled={!query.trim()} aria-label="Send message">
            <SendIcon />
            <span className="send-label">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(ChatWindow);
