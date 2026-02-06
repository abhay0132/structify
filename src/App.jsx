import { useState } from "react";
import "./App.css";
import FilePicker from "./components/FilePicker";
import AddCustomFile from "./components/AddCustomFile";
import TreePreview from "./components/TreePreview";
import MarkdownPreview from "./components/MarkdownPreview";
import { generateMarkdown } from "./utils/markdownBuilder";

export default function App() {
  const [files, setFiles] = useState([]);
  const [tree, setTree] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("");

  const IGNORE_LIST = [
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    ".vercel",
    "coverage",
    ".cache",
    ".vscode",
    "tmp",
    "out",
  ];

  function mergeFiles(newFiles) {
    const safeFiles = newFiles.filter((f) => {
      const path = f.path || "";
      return !IGNORE_LIST.some(
        (bad) => path.includes(`/${bad}/`) || path.startsWith(`${bad}/`)
      );
    });

    if (safeFiles.length < newFiles.length) {
      showStatus(`Ignored ${newFiles.length - safeFiles.length} system files`);
    }

    const merged = [...files];
    safeFiles.forEach((nf) => {
      if (!merged.some((sf) => sf.path === nf.path)) {
        merged.push(nf);
      }
    });

    setFiles(merged);
  }

  function handleAddFiles(batch) {
    mergeFiles(batch);
  }

  function handleAddBatch(newFiles) {
    mergeFiles(newFiles);
  }

  async function handleGenerate() {
    if (!files.length) return;
    setStatus("Generating...");
    const { tree, markdown } = await generateMarkdown(files);
    setTree(tree);
    setMarkdown(markdown);
    setStatus("Generated");
    setTimeout(() => setStatus(""), 2000);
  }

  function updateFilePath(index, newPath) {
    const updated = [...files];
    updated[index] = { ...updated[index], path: newPath };
    setFiles(updated);
  }

  function removeFile(index) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
  }

  function clearAllFiles() {
    setFiles([]);
    setTree("");
    setMarkdown("");
  }

  function showStatus(message) {
    setStatus(message);
    setTimeout(() => setStatus(""), 2000);
  }

  // Calculate stats
  const fileCount = files.length;
  const totalBytes = files.reduce((sum, f) => sum + (f.file?.size || 0), 0);
  const totalKB = Math.round(totalBytes / 1024);
  const folders = new Set();
  files.forEach((f) => {
    const parts = f.path.split("/");
    if (parts.length > 1) {
      folders.add(parts[0]);
    }
  });
  const folderCount = folders.size;

  return (
    <div className="container">
      <header>
        <h1>Structify</h1>
        <p className="subtitle">
          Package your codebase into clean Markdown. Built for sharing with
          ChatGPT, documentation, and code reviews.
        </p>
      </header>

      {files.length > 0 && (
        <div className="stats">
          <div className="stat">
            <div className="stat-value">{fileCount}</div>
            <div className="stat-label">Files</div>
          </div>
          <div className="stat">
            <div className="stat-value">{totalKB}</div>
            <div className="stat-label">KB</div>
          </div>
          <div className="stat">
            <div className="stat-value">{folderCount}</div>
            <div className="stat-label">Folders</div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>Select Files</h2>
          <span className="badge">Chrome/Edge only</span>
        </div>
        <FilePicker onAddFiles={handleAddFiles} />
        <div className="actions">
          <AddCustomFile onAddOne={handleAddBatch} />
        </div>
      </div>

      {files.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Selected Files</h2>
            <button className="btn btn-secondary btn-small" onClick={clearAllFiles}>
              Clear all
            </button>
          </div>
          <div className="file-list">
            {files.map((f, i) => (
              <div className="file-item" key={i}>
                <input
                  type="text"
                  className="file-path"
                  value={f.path}
                  onChange={(e) => updateFilePath(i, e.target.value)}
                />
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => removeFile(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <button
          className="btn"
          onClick={handleGenerate}
          disabled={!files.length}
        >
          {status === "Generating..." ? "Generating..." : "Generate Markdown"}
        </button>
      </div>

      {markdown && (
        <div className="output-grid">
          <TreePreview tree={tree} />
          <MarkdownPreview
            markdown={markdown}
            onCopy={() => {
              navigator.clipboard.writeText(markdown);
              showStatus("Copied");
            }}
          />
        </div>
      )}

      <div className="info">
        <h3>Why?</h3>
        <p>
          Quickly share entire projects with AI or collaborators without pushing
          to GitHub. Select files, generate clean Markdown with folder structure,
          copy or download.
        </p>

        <h3>How?</h3>
        <ol>
          <li>Select project folder (entire folders work in Chrome/Edge)</li>
          <li>Review and edit file paths if needed</li>
          <li>Generate Markdown</li>
          <li>Copy and paste into ChatGPT or download</li>
        </ol>
      </div>

      {status && status !== "Generating..." && (
        <div className="status">{status}</div>
      )}
    </div>
  );
}