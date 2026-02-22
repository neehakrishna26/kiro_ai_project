import { useState } from 'react'
import './App.css'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setLoading(true)
    setError(null)
    setResult(null)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Image Analyzer</h1>
          <p className="subtitle">Upload an image to detect steganography</p>
        </header>

        <div className="card">
          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-label">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="upload-text">
                {preview ? 'Change Image' : 'Choose Image'}
              </span>
              <span className="upload-hint">PNG, JPG up to 10MB</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
              className="file-input"
            />
          </div>

          {preview && (
            <div className="preview-section">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing image...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="alert-title">Error</p>
                <p className="alert-message">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="result-section">
              <div className="result-header">
                <h3>Analysis Results</h3>
              </div>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Filename</span>
                  <span className="result-value">{result.filename}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Size</span>
                  <span className="result-value">{(result.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Prediction</span>
                  <span className={`result-badge ${result.prediction === 'stego detected' ? 'badge-warning' : 'badge-success'}`}>
                    {result.prediction}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Confidence</span>
                  <span className="result-value">{result.confidence}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
