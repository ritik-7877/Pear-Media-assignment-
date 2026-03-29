import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch';


export default function TextWorkflow() {
  const [step, setStep] = useState(1); // 1: Input, 2: Review, 3: Result
  const [rawPrompt, setRawPrompt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [editedPrompt, setEditedPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnhance = useCallback(async () => {
    if (!rawPrompt.trim()) return;
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: rawPrompt }),
      });
      setAnalysis(data.data.analysis);
      setEnhancedPrompt(data.data.enhancedPrompt);
      setEditedPrompt(data.data.enhancedPrompt);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [rawPrompt]);

  const handleGenerate = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editedPrompt, style: selectedStyle }),
      });
      setGeneratedImage(data.data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [editedPrompt, selectedStyle]);

  const handleReset = () => {
    setStep(1);
    setRawPrompt('');
    setAnalysis(null);
    setEnhancedPrompt('');
    setEditedPrompt('');
    setSelectedStyle('');
    setGeneratedImage(null);
    setError('');
  };

  const downloadImage = () => {
    if (generatedImage?.url) {
      window.open(generatedImage.url, '_blank');
      return;
    }
    if (!generatedImage?.b64) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage.b64}`;
    link.download = 'pear-media-generated.png';
    link.click();
  };

  const stepStatuses = [
    { label: 'Input' },
    { label: 'Review' },
    { label: 'Result' },
  ];

  return (
    <div className="fade-in">
      {/* Step Indicator */}
      <div className="steps">
        {stepStatuses.map((s, i) => {
          const num = i + 1;
          const status = step > num ? 'completed' : step === num ? 'active' : '';
          return (
            <div key={num} className="step" style={{ flex: i < stepStatuses.length - 1 ? 1 : 0 }}>
              <div className={`step-num ${status}`}>{status === 'completed' ? '✓' : num}</div>
              <span className={`step-label ${status}`}>{s.label}</span>
              {i < stepStatuses.length - 1 && (
                <div className={`step-line ${step > num ? 'completed' : step === num ? 'active' : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Input ── */}
      {step === 1 && (
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-icon">✍️</div>
            <div>
              <div className="card-title">Describe Your Vision</div>
              <div className="card-subtitle">Enter any prompt — we'll analyze and enhance it for image generation</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="text-prompt-input">Your Prompt</label>
            <textarea
              id="text-prompt-input"
              className="form-textarea"
              rows={5}
              placeholder="e.g. A serene mountain lake at golden hour with pine trees reflecting in the water..."
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) handleEnhance();
              }}
            />
          </div>

          {error && (
            <div className="banner error" style={{ marginTop: 16 }}>
              <span className="banner-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="action-row" style={{ marginTop: 20 }}>
            <button
              id="enhance-text-btn"
              className="btn btn-primary btn-lg"
              onClick={handleEnhance}
              disabled={loading || !rawPrompt.trim()}
            >
              {loading ? <div className="spinner" /> : '✨'}
              {loading ? 'Analyzing & Enhancing...' : 'Enhance Prompt'}
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>or Ctrl + Enter</span>
          </div>
        </div>
      )}

      {/* ── Step 2: Review ── */}
      {step === 2 && (
        <div className="fade-in">
          {/* Analysis Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon">🔍</div>
              <div>
                <div className="card-title">Prompt Analysis</div>
                <div className="card-subtitle">Powered by Google Gemini</div>
              </div>
            </div>

            <div className="analysis-grid">
              {analysis?.tone && (
                <div className="analysis-item">
                  <div className="analysis-item-label">Tone & Mood</div>
                  <div className="analysis-item-value">{analysis.tone}</div>
                </div>
              )}
              {analysis?.subject && (
                <div className="analysis-item">
                  <div className="analysis-item-label">Subject</div>
                  <div className="analysis-item-value">{analysis.subject}</div>
                </div>
              )}
              {analysis?.style && (
                <div className="analysis-item">
                  <div className="analysis-item-label">Visual Style</div>
                  <div className="analysis-item-value">{analysis.style}</div>
                </div>
              )}
              {analysis?.intent && (
                <div className="analysis-item">
                  <div className="analysis-item-label">Intent</div>
                  <div className="analysis-item-value">{analysis.intent}</div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Prompt */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon">🚀</div>
              <div>
                <div className="card-title">Enhanced Prompt</div>
                <div className="card-subtitle">Edit and approve before generating</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="enhanced-prompt-textarea">Enhanced Prompt (editable)</label>
              <textarea
                id="enhanced-prompt-textarea"
                className="form-textarea"
                rows={7}
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
              />
            </div>

            {/* Art Style Chooser */}
            <div style={{ marginTop: 20 }}>
              <div className="form-label">Optional: Art Style Override</div>
              <div className="style-grid">
                {['Photorealistic', 'Oil Painting', 'Watercolor', 'Digital Art', 'Anime', 'Cinematic', '3D Render', 'Sketch'].map((s) => (
                  <button
                    key={s}
                    id={`style-${s.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`style-chip ${selectedStyle === s ? 'selected' : ''}`}
                    onClick={() => setSelectedStyle(selectedStyle === s ? '' : s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="banner error" style={{ marginTop: 16 }}>
                <span className="banner-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="action-row" style={{ marginTop: 24 }}>
              <button
                id="generate-image-btn"
                className="btn btn-success btn-lg"
                onClick={handleGenerate}
                disabled={loading || !editedPrompt.trim()}
              >
                {loading ? <div className="spinner" /> : '🎨'}
                {loading ? 'Generating Image...' : 'Approve & Generate Image'}
              </button>
              <button
                id="text-back-btn"
                className="btn btn-secondary"
                onClick={() => { setStep(1); setError(''); }}
                disabled={loading}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Result ── */}
      {step === 3 && generatedImage && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <div className="card-icon">🖼️</div>
              <div>
                <div className="card-title">Your Generated Image</div>
                <div className="card-subtitle">Created by DALL-E 3</div>
              </div>
            </div>

            <div className="result-image-wrap">
              <img
                src={generatedImage.url || `data:image/png;base64,${generatedImage.b64}`}
                alt="AI Generated"
                className="result-image"
                id="generated-result-image"
              />
              <div className="result-image-actions">
                <button id="download-image-btn" className="btn btn-primary btn-sm" onClick={downloadImage}>
                  ⬇ Download
                </button>
              </div>
            </div>

            {generatedImage.revisedPrompt && (
              <div className="revised-prompt">
                <strong style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Revised by DALL-E: </strong>
                {generatedImage.revisedPrompt}
              </div>
            )}

            <div className="action-row" style={{ marginTop: 24 }}>
              <button id="text-new-generation-btn" className="btn btn-primary" onClick={handleReset}>
                🔄 New Generation
              </button>
              <button
                id="text-back-to-review-btn"
                className="btn btn-secondary"
                onClick={() => { setStep(2); setGeneratedImage(null); setError(''); }}
              >
                ← Adjust Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
