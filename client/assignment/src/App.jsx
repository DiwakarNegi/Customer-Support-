import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const [threadId] = useState(`session-${Math.random().toString(36).substr(2, 9)}`);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:3000/api/chat', {
        message: input,
        threadId: threadId
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Is the server running?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Support AI Agent</h1>
        <p>Memory ID: {threadId}</p>
      </header>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {msg.content}
          </div>
        ))}
        {loading && <p className="loading">Assistant is thinking...</p>}
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask about billing or tech issues..." 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;