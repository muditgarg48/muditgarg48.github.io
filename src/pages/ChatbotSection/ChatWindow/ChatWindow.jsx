import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import './ChatWindow.css';
import { BotIntroContent } from '../BotIntro/BotIntro';
import { TypeAnimation } from 'react-type-animation';
import InfoIcon from '../../../assets/svg/InfoIcon';
import SendIcon from '../../../assets/svg/SendIcon';

const AVATAR_URLS = {
  bot: "https://img.icons8.com/?size=100&id=w9eNLzjc4dDx&format=png&color=000000",
  user: "https://img.icons8.com/?size=100&id=61992&format=png&color=000000"
};

const STATUS_TEXT = {
  online: 'Online',
  offline: 'Offline',
  waiting: 'Waiting'
};

const TYPING_SPEED = 100;
const THINKING_MESSAGE = 'Thinking ...';
const PROCESSED_MESSAGES_LIMIT = 100;

const getAvatarUrl = (person) => person === "bot" ? AVATAR_URLS.bot : AVATAR_URLS.user;

const getStatusText = (status) => STATUS_TEXT[status] || STATUS_TEXT.waiting;

const ChatInactive = memo(() => (
  <div id="chat-inactive">
    A.L.F.R.E.D. currently in hibernation.
  </div>
));

const MessageBubble = memo(({ chat, index, isTyping, shouldShowSources, onTypingComplete }) => {
  const messageKey = `${index}-${chat.message.substring(0, 50)}`;
  const showAvatar = chat.person !== "system";
  const avatarUrl = getAvatarUrl(chat.person);

  return (
    <div className={`${chat.person}-container`}>
      {showAvatar && (
        <img 
          src={avatarUrl}
          className="avatar"
          alt="conversationalist"
          loading="lazy"
        />
      )}
      <div className={`${chat.person}-message`}>
        {isTyping ? (
          <TypeAnimation
            key={messageKey}
            sequence={[chat.message, onTypingComplete]}
            speed={TYPING_SPEED}
            cursor={false}
            repeat={0}
            style={{ display: 'inline' }}
            wrapper="span"
          />
        ) : (
          chat.message
        )}
        {shouldShowSources && (
          <div className="context-sources">
            <span className="context-sources-label">From:</span>
            &nbsp;{chat.sources.join(' | ')}
          </div>
        )}
      </div>
    </div>
  );
});

const markMessageComplete = (setTypingMessages, index) => {
  setTypingMessages(prev => ({
    ...prev,
    [index]: { complete: true }
  }));
};

const ChatHistory = memo(({ chatHistory, botEndRef, typingMessages, setTypingMessages }) => {
  return (
    <div id="chat-history">
      {chatHistory.map((chat, index) => {
        const isTyping = chat.person === 'bot' && typingMessages[index] && !typingMessages[index].complete;
        const shouldShowSources = chat.person === 'bot' && chat.sources?.length > 0 && !isTyping;

        return (
          <MessageBubble
            key={`${chat.person}-${index}-${chat.message.substring(0, 20)}`}
            chat={chat}
            index={index}
            isTyping={isTyping}
            shouldShowSources={shouldShowSources}
            onTypingComplete={() => markMessageComplete(setTypingMessages, index)}
          />
        );
      })}
      <div ref={botEndRef}/>
    </div>
  );
});

const ChatWindow = ({
  query,
  setQuery,
  chatHistory,
  setChatHistory,
  chatActive,
  botStatus,
  botEndRef,
  handleSubmit,
  resetChat,
  onClose,
  onMinimize,
  onPopup
}) => {
  const [typingMessages, setTypingMessages] = useState({});
  const [isInfoOverlayOpen, setIsInfoOverlayOpen] = useState(false);
  const processedMessagesRef = useRef(new Set());
  const lastHistoryLengthRef = useRef(0);

  const handleResetChat = useCallback(() => {
    setTypingMessages({});
    processedMessagesRef.current.clear();
    lastHistoryLengthRef.current = 0;
    resetChat();
  }, [resetChat]);

  const processNewMessages = useCallback((newMessages, startIndex) => {
    newMessages.forEach((chat, offset) => {
      const index = startIndex + offset;
      if (chat.person === 'bot' && chat.message !== THINKING_MESSAGE) {
        const messageKey = `${index}-${chat.message.substring(0, 50)}`;
        if (!processedMessagesRef.current.has(messageKey)) {
          processedMessagesRef.current.add(messageKey);
          setTypingMessages(prev => ({
            ...prev,
            [index]: { complete: false }
          }));
        }
      }
    });
  }, []);

  const cleanupProcessedMessages = useCallback(() => {
    processedMessagesRef.current.clear();
    chatHistory.forEach((chat, idx) => {
      if (chat.person === 'bot' && chat.message !== THINKING_MESSAGE) {
        processedMessagesRef.current.add(`${idx}-${chat.message.substring(0, 50)}`);
      }
    });
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length > lastHistoryLengthRef.current) {
      const newMessages = chatHistory.slice(lastHistoryLengthRef.current);
      processNewMessages(newMessages, lastHistoryLengthRef.current);
      lastHistoryLengthRef.current = chatHistory.length;
      
      if (processedMessagesRef.current.size > PROCESSED_MESSAGES_LIMIT) {
        cleanupProcessedMessages();
      }
    }
  }, [chatHistory, processNewMessages, cleanupProcessedMessages]);

  const toggleInfoOverlay = useCallback(() => {
    setIsInfoOverlayOpen(prev => !prev);
  }, []);

  const closeInfoOverlay = useCallback(() => {
    setIsInfoOverlayOpen(false);
  }, []);

  return (
    <div id="chat-window">
      <div id="window-titlebar">
        <div className="titlebar-header">
          <div id="control-buttons">
            {onClose && <div id="close-button" onClick={onClose} title="Close"></div>}
            {onMinimize && <div id="expand-button" onClick={onMinimize} title="Minimize"></div>}
            {onPopup ? (
              <div id="minimize-button" onClick={(e) => { e.stopPropagation(); onPopup(); }} title="Switch to popup"></div>
            ) : (
              <div id="minimize-button" title="Does nothing"></div>
            )}
          </div>
          <div id="window-title">
            <span className="title-text">A.L.F.R.E.D.</span>
          </div>
          <div id="titlebar-right">
            { chatActive && (
              <div id="clear-button-titlebar" onClick={handleResetChat} title="Clear Chat">
                Clear Chat
              </div>
            )}
            <div 
              id="info-toggle-button" 
              onClick={toggleInfoOverlay}
              className={isInfoOverlayOpen ? "active" : ""}
              title={isInfoOverlayOpen ? "Hide A.L.F.R.E.D. info" : "Show A.L.F.R.E.D. info"}
            >
              <InfoIcon />
            </div>
            <div id="bot-status" className={`status-${botStatus}`}>
              <span className="status-dot"></span>
              <span className="status-text">{getStatusText(botStatus)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`info-overlay ${isInfoOverlayOpen ? "open" : ""}`}>
        <div className="info-overlay-content">
          <BotIntroContent />
        </div>
      </div>
      <div className="chat-area-container" onClick={closeInfoOverlay}>
        {chatActive ? (
          <ChatHistory 
            chatHistory={chatHistory} 
            botEndRef={botEndRef}
            typingMessages={typingMessages}
            setTypingMessages={setTypingMessages}
          />
        ) : (
          <ChatInactive/>
        )}
      </div>
      <div className="message-input-container" onClick={closeInfoOverlay}>
        <form onSubmit={handleSubmit} id="message-input" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={closeInfoOverlay}
            placeholder="Ask away..."
          />
          <button type="submit" id="send-button" disabled={!query.trim()}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(ChatWindow);