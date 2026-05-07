import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './index.css';

const TypewriterText = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    {
      sender: 'ai',
      text: 'PromptFolio System Initialized...\nWelcome to the interactive portfolio terminal. Ask me anything about my experience, architecture focus, or past projects.',
      isWelcome: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const endOfHistoryRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Requirement 3: Auto-focus input after AI finishes loading
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Requirement 2: Use Vite environment variable for API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        throw new Error(`Gateway Error: ${response.statusText}`);
      }

      const data = await response.json();

      setHistory(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (error) {
      console.error(error);
      setHistory(prev => [...prev, {
        sender: 'ai',
        text: `[SYSTEM ERROR] Connection failed. Is the AI Gateway running?\nDetails: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portfolio-layout">
      {/* Sidebar Profile Section */}
      <div className="sidebar">
        <div className="profile-photo">
          <img src="https://ui-avatars.com/api/?name=Mridul&background=00ffcc&color=050505&size=150" alt="Mridul" />
        </div>
        <h1 className="profile-name">Mridul</h1>
        <h2 className="profile-title">AI Engineering Assistant</h2>
        <div className="social-links">
          <a href="https://github.com/MriduL0017" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          {/* Requirement 4: Update Download CV link */}
          <a href="/LazzyDev_Resume.pdf" download className="download-btn">
            <span>Download CV</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>

      {/* Interactive Terminal Section */}
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="traffic-light red"></div>
          <div className="traffic-light yellow"></div>
          <div className="traffic-light green"></div>
          <span className="header-title">mridul@promptfolio: ~/ai-gateway</span>
        </div>

        <div className="chat-history">
          {history.map((msg, index) => (
            <div key={index} className="message">
              <div className={`message-sender ${msg.sender === 'user' ? 'user-sender' : 'ai-sender'}`}>
                {msg.sender === 'user' ? 'guest@local ~ %' : 'promptfolio ~ #'}
              </div>
              <div className="message-text">
                {msg.sender === 'ai' ? (
                  <TypewriterText text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message loading">
              Processing query... <span className="blinking-cursor"></span>
            </div>
          )}
          <div ref={endOfHistoryRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <span className="prompt-symbol">❯</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message... (e.g. 'What is your backend focus?')"
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
