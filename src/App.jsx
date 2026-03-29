import { useState } from 'react';
import './index.css';
import TextWorkflow from './components/TextWorkflow';
import ImageWorkflow from './components/ImageWorkflow';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <>
      {/* Animated Background */}
      <div className="app-bg" />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🍐</div>
          <span className="logo-text">Pear Media</span>
        </div>
        <div className="header-badge">AI Studio</div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Powered by Gemini &amp; DALL-E 3
        </div>
        <h1>
          Create with <span>AI-Powered</span><br />Text &amp; Image Generation
        </h1>
        <p className="hero-sub">
          Enhance your creative prompts with Gemini's NLP, then generate stunning images with DALL-E 3. Analyze any image and create beautiful variations.
        </p>
      </section>

      {/* Tab Selector */}
      <div className="tab-container">
        <div className="tab-group" role="tablist">
          <button
            id="tab-text"
            role="tab"
            aria-selected={activeTab === 'text'}
            className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Text → Image
          </button>
          <button
            id="tab-image"
            role="tab"
            aria-selected={activeTab === 'image'}
            className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            Image → Variation
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="main-content">
        {activeTab === 'text' ? <TextWorkflow /> : <ImageWorkflow />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>© 2025 Pear Media · AI Studio</span>
        <div className="footer-links">
          <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noreferrer">Gemini API</a>
          <a href="https://platform.openai.com/docs/guides/images" target="_blank" rel="noreferrer">DALL-E 3</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </>
  );
}

export default App;
