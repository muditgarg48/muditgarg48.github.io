import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow/ChatWindow';

const DEPLOYMENT_URL = "https://self-rag-system.onrender.com";
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
const MIN_MESSAGES_FOR_SCROLL = 5;
const THINKING_MESSAGE = "Thinking ...";

const INIT_MESSAGE = {
  person: "bot",
  message: "Hi there! I'm A.L.F.R.E.D. I know everything about Mudit. Ask away!",
  sources: [],
};

const ChatWindowContainer = ({ onClose, onMinimize, onPopup }) => {
  const [query, setQuery] = useState("");
  const [botStatus, setBotStatus] = useState("waiting");
  const [chatHistory, setChatHistory] = useState([INIT_MESSAGE]);
  const [chatActive, setChatActive] = useState(false);

  const botEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      botEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (chatHistory.length > MIN_MESSAGES_FOR_SCROLL) {
      scrollToBottom();
    }
  }, [chatHistory.length, scrollToBottom]);

  const pingServer = useCallback(async () => {
    try {
      await axios.get(`${DEPLOYMENT_URL}/stay_alive`);
    } catch (error) {
      console.error("Stay-alive ping failed:", error);
    }
  }, []);

  const checkServerStatus = useCallback(async () => {
    try {
      const response = await axios.get(DEPLOYMENT_URL);
      if (response.status === 200) {
        setBotStatus("online");
        setChatActive(true);
      } else {
        setBotStatus("offline");
        setChatActive(false);
      }
    } catch (error) {
      setBotStatus("offline");
      setChatActive(false);
      console.error("Server status check failed:", error);
    }
  }, []);

  useEffect(() => {
    checkServerStatus();
    pingServer();
    const intervalId = setInterval(pingServer, PING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [checkServerStatus, pingServer]);

  const resetChat = useCallback(() => {
    setChatHistory([INIT_MESSAGE]);
  }, []);

  const replaceThinkingMessage = useCallback((newMessage) => {
    setChatHistory(prevHistory => {
      const lastIndex = prevHistory.length - 1;
      if (prevHistory[lastIndex]?.message === THINKING_MESSAGE) {
        return [
          ...prevHistory.slice(0, lastIndex),
          newMessage
        ];
      }
      return prevHistory;
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.target.reset();
    
    const userQuery = query.trim();
    if (!userQuery) return;
    
    setQuery("");
    
    const userMessage = { person: "user", message: userQuery };
    const thinkingMessage = { person: "bot", message: THINKING_MESSAGE };
    
    setChatHistory(prevHistory => [...prevHistory, userMessage, thinkingMessage]);

    try {
      const formData = new FormData();
      formData.append('user_query', userQuery);
      const response = await axios.post(`${DEPLOYMENT_URL}/query`, formData);
      
      replaceThinkingMessage({
        person: "bot",
        message: response.data.answer,
        sources: response.data.sources || []
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error
        ? `Could not retrieve an answer because ${error.response.data.error}`
        : "Could not retrieve an answer due to a server error";
      
      replaceThinkingMessage({
        person: "system",
        message: errorMessage
      });
      console.error("Chat error:", error);
    }
  }, [query, replaceThinkingMessage]);

  return (
    <ChatWindow 
      query={query}
      setQuery={setQuery}
      chatHistory={chatHistory}
      setChatHistory={setChatHistory}
      chatActive={chatActive}
      botStatus={botStatus}
      botEndRef={botEndRef}
      handleSubmit={handleSubmit}
      resetChat={resetChat}
      onClose={onClose}
      onMinimize={onMinimize}
      onPopup={onPopup}
    />
  );
};

export default ChatWindowContainer;
