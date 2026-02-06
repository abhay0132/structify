import { useState } from "react";

export default function MarkdownPreview({ markdown, onCopy }) {
  const [filename, setFilename] = useState("structify_export");

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (filename.trim() || "structify_export") + ".md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="output-title">Markdown</div>
        <div className="output-actions">
          <button className="text-btn" onClick={onCopy}>
            Copy
          </button>
        </div>
      </div>
      <div className="output-content">
        <pre className="markdown-view">{markdown || "No markdown yet"}</pre>
      </div>
      <div
        className="output-header"
        style={{
          borderTop: "1px solid var(--gray-200)",
          borderBottom: "none",
        }}
      >
        <div className="filename-group">
          <input
            type="text"
            className="filename-input"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="filename"
          />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: "var(--gray-500)",
            }}
          >
            .md
          </span>
          <button className="text-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}