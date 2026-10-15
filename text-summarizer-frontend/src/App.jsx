import React, { useState } from "react";
import FileUpload from "./Components/FileUpload";
import TextSummarizer from "./Components/TextSummarizer";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <div className="app-wrapper">
      {/* Animated Gradient Background */}
      <div className="animated-bg">
        <div className="gradient-bg"></div>
      </div>

      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="app-icon">🧠</span> LegalSummarizer AI
          </h1>
          <p className="app-subtitle">
            Transform complex legal documents into clear, concise summaries
          </p>
        </header>

        <main className="app-main">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "text" ? "active" : ""}`}
              onClick={() => setActiveTab("text")}
            >
              <span className="tab-icon">📄</span> Text Input
            </button>
            <button
              className={`tab-button ${activeTab === "file" ? "active" : ""}`}
              onClick={() => setActiveTab("file")}
            >
              <span className="tab-icon">📂</span> File Upload
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "text" ? <TextSummarizer /> : <FileUpload />}
          </div>
        </main>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Legal Summarizer AI - Final Year Project</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
