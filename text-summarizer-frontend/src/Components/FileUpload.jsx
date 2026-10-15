import { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [generateAudio, setGenerateAudio] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF, DOC, and DOCX files are supported');
      setFile(null);
      setFileName('');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('to_speech', generateAudio);

    try {
      setError('');
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(response.data.summary);
      setAudioUrl(response.data.audio_url || null);
    } catch (error) {
      setError('File processing failed. Please try again with another file.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFile(null);
    setFileName('');
    setSummary('');
    setAudioUrl(null);
    setError('');
  };

  return (
    <div className="fileupload-container">
      <div className="input-section">
        <div
          className={`file-drop-area ${dragActive ? 'active' : ''} ${fileName ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={(e) => handleFileChange(e.target.files[0])}
            accept=".pdf,.doc,.docx"
          />

          {!fileName ? (
            <label htmlFor="file-input" className="file-label">
              <div className="upload-icon">📄</div>
              <div className="upload-text">
                <span className="upload-title">Drop your legal document here</span>
                <span className="upload-subtitle">or click to browse files (PDF, DOC, DOCX)</span>
              </div>
            </label>
          ) : (
            <div className="file-info">
              <span className="file-name">{fileName}</span>
              <button
                className="remove-file-button"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                  setFileName('');
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="controls">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={generateAudio}
              onChange={() => setGenerateAudio(!generateAudio)}
              className="checkbox-input"
            />
            <span className="checkbox-label">Enable Text-to-Speech</span>
          </label>

          <div className="button-group">
            <button
              onClick={clearAll}
              className="clear-button"
              disabled={loading || (!file && !summary)}
            >
              Clear All
            </button>
            <button
              onClick={handleFileUpload}
              disabled={loading || !file}
              className="summarize-button"
            >
              {loading ? 'Processing...' : 'Process Document'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Analyzing document...</p>
        </div>
      )}

      {summary && !loading && (
        <div className="results-section">
          <h3 className="summary-title">
            <span className="summary-icon">📝</span> Document Summary
          </h3>
          <div className="summary-content">{summary}</div>

          {audioUrl && (
            <div className="audio-section">
              <h4 className="audio-title">
                <span className="audio-icon">🔊</span> Audio Version
              </h4>
              <audio controls className="audio-player">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
