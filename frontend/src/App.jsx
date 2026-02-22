import { useState } from 'react'

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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Image Analyzer</h1>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload}
        disabled={loading}
      />
      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '400px', maxHeight: '400px', borderRadius: '4px' }} />
        </div>
      )}
      {loading && <p>Analyzing...</p>}
      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
          <p><strong>Filename:</strong> {result.filename}</p>
          <p><strong>Size:</strong> {result.size} bytes</p>
          <p><strong>Prediction:</strong> {result.prediction}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  )
}

export default App
