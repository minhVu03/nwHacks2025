import React, { useState } from 'react';
import './App.css';
import foodBankImage from './images/food-bank.png';
import megaphoneImage from './images/megaphone.png';

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
      {/* Landing Section */}
      <div className="landing">
        <div className="landing-left-box">
          <h2>Fire Warrior</h2>
          <span>
            All in 1 website to help you get ready for wildfires & evacuation
          </span>
        </div>
        <div>
          <div>MAP</div>
          <button>Search Wildfires In The Area</button>
        </div>
      </div>

      {/* Body Section */}
      <div className="body">
        <div className="row row-two">
          <div className="big-card air style-border">
            <span className="box-title">Air Quality</span>
            <div className="score-box">
              <span>43</span>
              <span>Good</span>
              <div>
                <p>Health Advisory</p>
                <span>
                  Air quality is satisfactory. Outdoor activities are safe.
                </span>
              </div>
            </div>
          </div>
          <div className="big-card news style-border">
            <span className="box-title">News & Media</span>
            <div className="news-card-wrapper">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="news-card style-border">
                  <img src={megaphoneImage} alt="News" />
                  <div className="news-info">
                    <span>title</span>
                    <span>desc</span>
                    <span>date</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row row-two">
          <div className="big-card food-bank style-border">
            <span className="box-title">Food Banks</span>
            <div className="small-card-wrapper">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="small-card style-border">
                  <span>Kamloops Food Bank</span>
                  <img src={foodBankImage} alt="Food Bank" />
                  <span>
                    Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada
                  </span>
                  <span>Phone: +1 250-376-2252</span>
                  <span>Hours: Mon-Fri: 8:00 AM - 2:00 PM</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row row-three">
          <div className="big-card hospital style-border">
            <span className="box-title">Hospitals & Shelters</span>
            <div className="small-card-wrapper hospital">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="small-card style-border">
                  <span>Kamloops Food Bank</span>
                  <img src={foodBankImage} alt="Food Bank" />
                  <span>
                    Address: 171 Wilson St, Kamloops, BC V2B 2M4, Canada
                  </span>
                  <span>Phone: +1 250-376-2252</span>
                  <span>Hours: Mon-Fri: 8:00 AM - 2:00 PM</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row row-four style-border">
          <div>
            <span>checklist</span>
          </div>
        </div>
      </div>

      {/* Chatbot Icon */}
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
