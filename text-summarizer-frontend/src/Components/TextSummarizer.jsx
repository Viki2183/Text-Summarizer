import { useState } from 'react';
import axios from 'axios';

function TextSummarizer() {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [generateAudio, setGenerateAudio] = useState(false);
    const [error, setError] = useState('');

    const handleTextSummarize = async () => {
        if (!text.trim()) {
            setError('Please enter some text to summarize');
            return;
        }

        try {
            setError('');
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/summarize/', {
                text,
                to_speech: generateAudio,
            });

            setSummary(response.data.summary);
            setAudioUrl(response.data.audio_url || null);
        } catch (error) {
            setError('Failed to summarize text. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setText('');
        setSummary('');
        setAudioUrl(null);
        setError('');
    };

    return (
        <div className="summarizer-container">
            <div className="input-section">
                <div className="form-group">
                    <label htmlFor="legal-text" className="input-label">Enter Legal Text:</label>
                    <textarea
                        id="legal-text"
                        className="text-input"
                        rows="8"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your legal document text here..."
                    />
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
                            disabled={loading || (!text && !summary)}
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleTextSummarize}
                            disabled={loading || !text.trim()}
                            className="summarize-button"
                        >
                            {loading ? 'Processing...' : 'Summarize Text'}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p className="loading-text">Analyzing legal text...</p>
                </div>
            )}

            {summary && !loading && (
                <div className="results-section">
                    <h3 className="summary-title">
                        <span className="summary-icon">📝</span> Summary Result
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

export default TextSummarizer;