import { useMemo, useState } from "react";
import "./App.css";
import FilePicker from "./components/FilePicker";
import AddCustomFile from "./components/AddCustomFile";
import TreePreview from "./components/TreePreview";
import MarkdownPreview from "./components/MarkdownPreview";
import {
  normalizePath,
  getDirname,
  findCommonFolderPath,
  inferFolderForBatch,
} from "./utils/pathUtils";
import { generateMarkdown } from "./utils/markdownBuilder";

export default function App() {
  const [files, setFiles] = useState([]);
  const [tree, setTree] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("");

  const knownFolders = useMemo(() => {
    const set = new Set();
    for (const f of files) {
      const dir = getDirname(f.path);
      if (dir) set.add(dir);
    }
    return Array.from(set).sort();
  }, [files]);

  function mergeFiles(newFiles) {
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
      "out"
    ];

    const safeFiles = newFiles.filter((f) => {
      const path = f.path || "";
      return !IGNORE_LIST.some(
        (bad) => path.includes(`/${bad}/`) || path.startsWith(`${bad}/`)
      );
    });

    if (safeFiles.length < newFiles.length) {
      setStatus("Ignored system folders (node_modules, .git, build...)");
      setTimeout(() => setStatus(""), 4000);
    }

    const normalized = safeFiles.map((f) => ({
      ...f,
      path: normalizePath(f.path),
    }));

    const merged = [
      ...files,
      ...normalized.filter((nf) => !files.some((sf) => sf.path === nf.path)),
    ];
    setFiles(merged);
  }

  function handleAddFiles(batch) {
    mergeFiles(batch);
  }

  function handleAddBatch(newFiles) {
    if (!newFiles.length) return;

    const noFolder = newFiles.every((f) => !f.path.includes("/"));
    if (noFolder) {
      const inferred = inferFolderForBatch(newFiles.map((f) => f.file), files);
      const prefixed = newFiles.map((f) => ({
        ...f,
        path: inferred ? `${inferred}/${f.file.name}` : f.file.name,
      }));
      mergeFiles(prefixed);
      setStatus(`Added ${newFiles.length} file(s) → “${inferred}/”`);
      setTimeout(() => setStatus(""), 2500);
    } else mergeFiles(newFiles);
  }

  async function handleGenerate() {
    if (!files.length) return;
    setStatus("Generating...");
    const norm = files.map((f) => ({ ...f, path: normalizePath(f.path) }));
    const { tree, markdown } = await generateMarkdown(norm);
    setTree(tree);
    setMarkdown(markdown);
    setStatus("Markdown ready!");
    setTimeout(() => setStatus(""), 2500);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 2000);
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function editPath(index, newPath) {
    const updated = [...files];
    updated[index] = { ...updated[index], path: normalizePath(newPath) };
    setFiles(updated);
  }

  function removeFile(index) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    const common = findCommonFolderPath(updated.map((f) => f.path));
    if (common) setStatus(`Removed. Active folder: ${common}`);
  }

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <header className="app-header">
          <h1>Structify</h1>
          <p>Instantly package your code and folder structure into one Markdown file.</p>
        </header>

        <div className="picker-card">
          <FilePicker onAddFiles={handleAddFiles} />
          <AddCustomFile onAddOne={handleAddBatch} />
        </div>

        {files.length > 0 && (
          <div className="file-list-card">
            <h3>Selected Files ({files.length})</h3>
            <ul>
              {files.map((f, i) => (
                <li key={i}>
                  <input
                    type="text"
                    value={f.path}
                    onChange={(e) => editPath(i, e.target.value)}
                  />
                  <button onClick={() => removeFile(i)}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="generate-row">
          <button
            onClick={handleGenerate}
            disabled={!files.length}
            className="generate-btn"
          >
            Generate Markdown
          </button>
          <p className="status">{status}</p>
        </div>

        <div className="output-section">
          <div className="output-column">
            <h4>Folder Structure</h4>
            <div className="scroll-box">
              <TreePreview tree={tree} />
            </div>
          </div>
          <div className="output-column">
            <h4>Markdown Output</h4>
            <div className="scroll-box markdown-box">
              <MarkdownPreview
                markdown={markdown}
                onCopy={copy}
                onDownload={download}
              />
            </div>
          </div>
        </div>

        <section className="why-section">
          <h3>💡 Why Use Structify?</h3>
          <p>
            When you want to quickly share your project with ChatGPT or someone else —  
            but don’t have time to push it to GitHub — Structify helps you select only the 
            important files, builds a clean folder structure, and combines them into one 
            Markdown file ready to copy or send instantly.
          </p>
        </section>

        <section className="guide-section">
          <h3>🚀 How to Use</h3>
          <ol>
            <li>Click <b>Choose Files</b> to select project files or folders.</li>
            <li>Click <b>Generate Markdown</b>.</li>
            <li>Copy or download your Markdown file.</li>
            <li>Paste it directly into ChatGPT or share with others.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
