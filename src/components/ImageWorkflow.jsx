import { useState, useRef, useCallback } from 'react';
import { apiFetch } from '../utils/apiFetch';

const COLOR_TAGS = ['cyan', '', 'pink', 'cyan', '', 'pink'];

export default function ImageWorkflow() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Analysis, 3: Variation Result
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewURL, setImagePreviewURL] = useState('');
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [generatedVariation, setGeneratedVariation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, GIF).');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreviewURL(URL.createObjectURL(file));
    setAnalysis(null);
    setGeneratedVariation(null);
    setStep(1);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, [handleFile]);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const data = await apiFetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });
      setAnalysis(data.data);
      setSelectedVariation(0);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [imageFile]);

  const handleGenerateVariation = useCallback(async () => {
    if (!analysis?.variationPrompts?.[selectedVariation]) return;
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/generate-variation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variationPrompt: analysis.variationPrompts[selectedVariation],
          analysis: { mood: analysis.mood, style: analysis.style, theme: analysis.theme },
        }),
      });
      setGeneratedVariation(data.data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [analysis, selectedVariation]);

  const handleReset = () => {
    setStep(1);
    setImageFile(null);
    setImagePreviewURL('');
    setAnalysis(null);
    setGeneratedVariation(null);
    setSelectedVariation(0);
    setError('');
  };

  const downloadVariation = () => {
    if (generatedVariation?.url) {
      window.open(generatedVariation.url, '_blank');
      return;
    }
    if (!generatedVariation?.b64) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedVariation.b64}`;
    link.download = 'pear-media-variation.png';
    link.click();
  };

  const stepStatuses = [
    { label: 'Upload' },
    { label: 'Analyze' },
    { label: 'Variation' },
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

      {/* ── Step 1: Upload ── */}
      {step === 1 && (
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-icon">🖼️</div>
            <div>
              <div className="card-title">Upload Your Image</div>
              <div className="card-subtitle">We'll analyze it and generate creative variations</div>
            </div>
          </div>

          {!imagePreviewURL ? (
            <div
              id="image-upload-zone"
              className={`upload-zone ${dragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📁</div>
              <div className="upload-text">Drop your image here</div>
              <div className="upload-hint">or <span>click to browse</span> — JPEG, PNG, WebP, GIF up to 10MB</div>
              <input
                ref={fileInputRef}
                id="image-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div>
              <div className="image-preview-wrap">
                <img src={imagePreviewURL} alt="Preview" className="image-preview" id="uploaded-image-preview" />
                <div className="image-preview-overlay">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setImageFile(null); setImagePreviewURL(''); }}
                  >
                    🔄 Change Image
                  </button>
                </div>
              </div>
              <div className="banner info" style={{ marginTop: 12 }}>
                <span className="banner-icon">💡</span>
                <span>Image ready. Click <strong>Analyze</strong> to extract themes, objects, and generate variation prompts using Gemini Vision.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="banner error" style={{ marginTop: 16 }}>
              <span className="banner-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="action-row" style={{ marginTop: 20 }}>
            <button
              id="analyze-image-btn"
              className="btn btn-primary btn-lg"
              onClick={handleAnalyze}
              disabled={loading || !imageFile}
            >
              {loading ? <div className="spinner" /> : '🔍'}
              {loading ? 'Analyzing Image...' : 'Analyze Image'}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Analysis ── */}
      {step === 2 && analysis && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <div className="card-icon">🔍</div>
              <div>
                <div className="card-title">Image Analysis</div>
                <div className="card-subtitle">Powered by Google Gemini Vision</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 24 }}>
              {/* Thumbnail */}
              <div className="image-preview-wrap" style={{ maxHeight: 220 }}>
                <img src={imagePreviewURL} alt="Uploaded" className="image-preview" style={{ maxHeight: 220 }} />
              </div>
              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {analysis.caption && (
                  <div className="analysis-item" style={{ gridColumn: '1 / -1' }}>
                    <div className="analysis-item-label">Caption</div>
                    <div className="analysis-item-value" style={{ fontStyle: 'italic', fontSize: 15 }}>"{analysis.caption}"</div>
                  </div>
                )}
                <div className="analysis-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 0 }}>
                  {analysis.mood && (
                    <div className="analysis-item">
                      <div className="analysis-item-label">Mood</div>
                      <div className="analysis-item-value">{analysis.mood}</div>
                    </div>
                  )}
                  {analysis.style && (
                    <div className="analysis-item">
                      <div className="analysis-item-label">Style</div>
                      <div className="analysis-item-value">{analysis.style}</div>
                    </div>
                  )}
                  {analysis.theme && (
                    <div className="analysis-item">
                      <div className="analysis-item-label">Theme</div>
                      <div className="analysis-item-value">{analysis.theme}</div>
                    </div>
                  )}
                  {analysis.composition && (
                    <div className="analysis-item">
                      <div className="analysis-item-label">Composition</div>
                      <div className="analysis-item-value">{analysis.composition}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {analysis.objects?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="analysis-item-label" style={{ marginBottom: 8 }}>Detected Objects</div>
                <div className="tags">
                  {analysis.objects.map((o, i) => (
                    <span key={i} className={`tag ${COLOR_TAGS[i % COLOR_TAGS.length]}`}>{o}</span>
                  ))}
                </div>
              </div>
            )}

            {analysis.colorPalette?.length > 0 && (
              <div>
                <div className="analysis-item-label" style={{ marginBottom: 8 }}>Color Palette</div>
                <div className="tags">
                  {analysis.colorPalette.map((c, i) => (
                    <span key={i} className="tag pink">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variation Selection */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon">✨</div>
              <div>
                <div className="card-title">Choose a Variation</div>
                <div className="card-subtitle">Select one variation to generate with DALL-E 3</div>
              </div>
            </div>

            <div className="variation-list">
              {analysis.variationPrompts?.map((vp, i) => (
                <div
                  key={i}
                  id={`variation-option-${i}`}
                  className={`variation-item ${selectedVariation === i ? 'selected' : ''}`}
                  onClick={() => setSelectedVariation(i)}
                >
                  <div className="variation-num">{i + 1}</div>
                  <div className="variation-text">{vp}</div>
                </div>
              ))}
            </div>

            {error && (
              <div className="banner error" style={{ marginTop: 16 }}>
                <span className="banner-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="action-row" style={{ marginTop: 24 }}>
              <button
                id="generate-variation-btn"
                className="btn btn-success btn-lg"
                onClick={handleGenerateVariation}
                disabled={loading}
              >
                {loading ? <div className="spinner" /> : '🎨'}
                {loading ? 'Generating Variation...' : 'Generate This Variation'}
              </button>
              <button
                id="image-back-btn"
                className="btn btn-secondary"
                onClick={() => { setStep(1); setError(''); }}
                disabled={loading}
              >
                ← Change Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Variation Result ── */}
      {step === 3 && generatedVariation && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <div className="card-icon">🎨</div>
              <div>
                <div className="card-title">Generated Variation</div>
                <div className="card-subtitle">Created by DALL-E 3 · Variation {selectedVariation + 1}</div>
              </div>
            </div>

            {/* Side-by-side comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <div className="form-label" style={{ marginBottom: 8, textAlign: 'center' }}>Original</div>
                <div className="image-preview-wrap">
                  <img src={imagePreviewURL} alt="Original" className="image-preview" style={{ maxHeight: 320 }} />
                </div>
              </div>
              <div>
                <div className="form-label" style={{ marginBottom: 8, textAlign: 'center' }}>Variation {selectedVariation + 1}</div>
                <div className="result-image-wrap">
                  <img
                    src={generatedVariation.url || `data:image/png;base64,${generatedVariation.b64}`}
                    alt="Generated Variation"
                    className="result-image"
                    id="variation-result-image"
                    style={{ maxHeight: 320, objectFit: 'cover' }}
                  />
                  <div className="result-image-actions">
                    <button id="download-variation-btn" className="btn btn-primary btn-sm" onClick={downloadVariation}>
                      ⬇ Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {generatedVariation.revisedPrompt && (
              <div className="revised-prompt">
                <strong style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Revised by DALL-E: </strong>
                {generatedVariation.revisedPrompt}
              </div>
            )}

            <div className="action-row" style={{ marginTop: 24 }}>
              <button id="try-another-variation-btn" className="btn btn-primary" onClick={() => { setStep(2); setGeneratedVariation(null); setError(''); }}>
                🔄 Try Another Variation
              </button>
              <button id="image-new-btn" className="btn btn-secondary" onClick={handleReset}>
                📁 Upload New Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
