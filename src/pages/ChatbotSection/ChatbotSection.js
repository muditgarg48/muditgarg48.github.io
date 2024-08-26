import React, {useState, useEffect, useRef} from 'react'
// import React, {useState, useEffect} from 'react'
import './ChatbotSection.css'
import axios from 'axios';

import SectionHeading from '../../components/SectionHeading/SectionHeading';

function ChatbotSection() {

  // const deployment = "https://self-rag-system.onrender.com"
  const deployment = "https://self-rag-system-production.up.railway.app";

  const initMessage = {
    person: "alfred",
    message: "Hi there! I'm A.L.F.R.E.D. I know everything about Mudit. Ask away!",
    sources: [],
  };

  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([initMessage]);
  const [chatActive, setChatActive] = useState(false);

  const alfredEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatHistory.length > 5)
      alfredEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function checkServerStatus() {
      try {
        const response = await axios.get(deployment);
        if(response.status === 200) {
          setChatActive(true);
          console.log("A.L.F.R.E.D. Online!");
        }
        else {
          setChatActive(false);
          console.log("A.L.F.R.E.D. is having some issues!")
        }
      } catch (Exception) {
        console.log("Theres something wrong with the server! Response: "+Exception);
      }
    }
    checkServerStatus();
  }, []);

  useEffect(() => {
    scrollToBottom(); 
  }, [chatHistory]);

  const resetChat = () => {
    setChatHistory([initMessage]);
  }

  const refreshData = async () => {
    let message = "";
    try {
      const response = await axios.get(deployment+'/refresh_files');
      if(response.status === 200) {
        message = "Data successfully refreshed";
      } else {
        message = response.data;
      }
    } catch (error) {
      message = error.response.data.error;
    }
    let newHistory = [ ...chatHistory, {
        person: "system",
        message: message
      }
    ]
    setChatHistory(newHistory);
  }

  const refreshDatabase = async () => {
    let message = "";
    try {
      const response = await axios.get(deployment+'/prepare_database');
      if(response.status === 200) {
        message = "Chroma Vector database successfully refreshed"
      } else {
        message = response.data;
      }
    } catch (error) {
      message = error.response.data.error
    }
    let newHistory = [ ...chatHistory, {
        person: "system",
        message: message
      }
    ]
    setChatHistory(newHistory);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    e.target.value = "";
    try {
      let newHistory = [...chatHistory, {
        person: "user",
        message: query,
      }, {
        person: "alfred",
        message: "Thinking ..."
      }];
      setChatHistory(newHistory);
      console.log(query);
      const formData = new FormData();
      formData.append('user_query', query);
      setQuery("");
      const response = await axios.post(deployment+'/query', formData);
      console.log(response);
      newHistory.pop();
      newHistory = [...newHistory, {
        person: "alfred",
        message: response.data.answer,
        sources: response.data.sources
      }];
      setChatHistory(newHistory);
    } catch (error) {
      setChatHistory([...chatHistory, {
        person: "system",
        message: "Could not retrieve an answer because "+error.response.data.error
      }]);
      console.error(error);
    }
  };

  return (
    <div id="chatbot-section">
      <SectionHeading section_name="MEET A.L.F.R.E.D."/>
      <div id="alfred-intro">
        <p style={{textAlign: "center"}}>
          Meet A.L.F.R.E.D. <strong>A</strong> <strong>L</strong>oyal <strong>F</strong>riend <strong>R</strong>eady to <strong>E</strong>nlighten <strong>D</strong>aily. Patent pending.
        </p>
        &nbsp;
        <p>
          A.L.F.R.E.D. is my personal buddy whom I have employed on my website to cater to your every question about me in real time. Wages not disclosed.
        </p>
        <p>
          Technically, A.L.F.R.E.D is a Retrieval Augmented Generation (RAG) system powered by Gemini 1.5 Flash backed up by my personal data on the website to answer every question about me if you ever feel not wanting to explore the whole website. But thats just technical jibber-jabber.
        </p>
        <p style={{textAlign: "center"}}>
          Ask Away!
        </p>
      </div>
      <div id="chat-window">
        <div id="window-titlebar">
          <div id="control-buttons">
            <><div id="close-button"></div></>
            <div id="expand-button"></div>
            <div id="minimize-button"></div>
          </div>
          &nbsp;
          { chatActive &&
            <div id="action-buttons">
              <div id="clear-button" onClick={() => resetChat()}>Clear Chat</div>
              {/* <div id="refresh-data" onClick={() => refreshData()}>Data Reload</div> */}
              {/* <div id="refresh-db" onClick={() => refreshDatabase()}>Database Reload</div> */}
            </div>
          }
        </div>
        {
          chatActive === true?
            <ChatHistory chatHistory={chatHistory} alfredEndRef={alfredEndRef}/>:
            <ChatInactive/>
        }
        <div style={{display: "flex", justifyContent: "center"}}>
          <form onSubmit={handleSubmit} id="message-input">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask away..."
            />
            {/* <button type="submit" id="submit">
              <img 
                src="https://img.icons8.com/?size=100&id=93330&format=png&color=000000" 
                alt="ask" 
                height="40%" 
                width="40%"
              />
            </button> */}
          </form>
        </div>
      </div>
    </div>
  )
}

function ChatInactive() {
  return (
    <div id="chat-inactive">
      A.L.F.R.E.D. currently in hibernation
    </div>
  );
}

function ChatHistory({chatHistory, alfredEndRef}) {
  // function ChatHistory({chatHistory}) {
  return (
    <div id="chat-history">
      {
        chatHistory.map((chat, index) => {
          return(
            <div key={index} className={`${chat.person}-container`}>
              { chat.person !== "system" &&
                <img 
                  src={ chat.person === "alfred"?
                    "https://img.icons8.com/?size=100&id=w9eNLzjc4dDx&format=png&color=000000":
                    "https://img.icons8.com/?size=100&id=61992&format=png&color=000000"
                  }
                  className="avatar"
                  alt="conversationalist"
                />
              }
              <div className={`${chat.person}-message`}>
                {chat.message}
                {chat.person === 'alfred' && chat.sources?.length>0 && <div className="context-sources">
                  <span style={{textDecoration: "underline"}}>
                    From:
                  </span>
                  &nbsp;
                  {chat.sources.join(' | ')}
                </div>}
              </div>
            </div>
          );
        })
      }
      <div ref={alfredEndRef}/>
    </div>
  );
}

export default ChatbotSection