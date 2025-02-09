import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import './ChatWidget.css'; // Make sure you have the CSS file for styling

const WebSocketComponent = () => {
  const socketUrl = 'ws://localhost:8000/ws/chat/';
  const [messages, setMessages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Track if chat is open or closed
  const [input, setInput] = useState(''); // Store the user input message

  // Use the useWebSocket hook with the desired socket URL and options
  const { sendMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket opened'),
    shouldReconnect: () => false, // Disable reconnection
    onMessage: (message) => {
      setMessages((prevMessages) => [...prevMessages, message.data]); // Add new message to the list
    },
  });

  const handleSendMessage = () => {
    if (input.trim()) {
      // Create a JSON object
      const messageObj = { message: input };
  
      // Send the message as a JSON string
      sendMessage(JSON.stringify(messageObj));
  
      setMessages((prevMessages) => [...prevMessages, input]); // Add the message to the local list of messages
      setInput(''); // Clear the input after sending
    }
  };
  

  // Toggle the chat window visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Floating chat icon */}
      <button className="chat-icon" onClick={toggleChat}>
        💬
      </button>

      {isOpen && (
        <div className="chat-box">
          <h1>WebSocket Chat</h1>

          {/* Message input form */}
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} // Update the input state on change
              className="input-field"
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage} className="send-button">
              ➤
            </button>
          </div>

          {/* Messages display */}
          <div>
            <h2>Messages</h2>
            {messages.length === 0 ? (
              <p>No messages received yet.</p>
            ) : (
              <ul>
                {messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Ready state display */}
          <div>
            <h2>Ready State</h2>
            <p>{readyState}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;
