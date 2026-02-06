export default function FilePicker({ onAddFiles }) {
  const handleSelect = (e) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;

    const newFiles = chosen.map((f) => ({
      path: f.webkitRelativePath || f.name,
      file: f,
    }));

    onAddFiles(newFiles);
    e.target.value = "";
  };

  return (
    <>
      <label htmlFor="folderInput">
        <div className="upload-zone">
          <div className="upload-text">Select folder or drop here</div>
          <div className="upload-hint">
            Auto-excludes node_modules • .git • build • dist
          </div>
        </div>
      </label>
      <input
        id="folderInput"
        type="file"
        multiple
        webkitdirectory="true"
        onChange={handleSelect}
        style={{ display: "none" }}
      />
    </>
  );
}