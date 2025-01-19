import React, { useState } from 'react';
import './App.css';

function App() {
  const [showChatbox, setShowChatbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: 'user', text: userInput }]);
    setUserInput('');

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userInput }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: data.response },
        ]);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      {/* Existing components */}
      <div className="landing">
        <div className="landing-left-box"> 
          <h2>Fire Warrior</h2>
          <span>All in 1 website to help you get ready for wildfires & evacuation</span>
        </div>
        <div>
          <div>MAP</div>
          <button>Search Wildfires In The Area</button>
        </div>
      </div>
      <div className="body">
        <div className="row row-one">
          <div className="big-card style-border">
            <p className="box-title">Air Quality</p>
          </div>
          <div className="big-card style-border">
            <p className="box-title">News & Media</p>
          </div>
        </div>
        <div className="row row-two style-border">
          <div className="big-card style-border">
            <span className="box-title">Food Banks</span>
            <div className="small-card style-border">
              <span>title</span>
              <span>Address</span>
              <span>Phone</span>
              <span>Hour</span>
            </div>
            <div className="small-card style-border">
              <span>title</span>
              <span>Address</span>
              <span>Phone</span>
              <span>Hour</span>
            </div>
          </div>
          <div className="big-card style-border">
            <span className="box-title">Hospitals & Shelters</span>
          </div>
        </div>
        <div className="row row-three style-border">
          <div>
            <span>checklist</span>
          </div>
        </div>
      </div>

      {/* Chatbot icon */}
      <div className="chat-icon" onClick={toggleChatbox}>
        💬
      </div>

      {/* Chatbox */}
      {showChatbox && (
        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
