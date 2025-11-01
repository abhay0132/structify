export default function FilePicker({ onAddFiles }) {
  const handleSelect = (e) => {
    const chosen = Array.from(e.target.files || []);
    if (!chosen.length) return;

    const newFiles = chosen.map((f) => ({
      path: f.webkitRelativePath || f.name, // Chrome keeps full folder path
      file: f,
    }));

    onAddFiles(newFiles);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple
        webkitdirectory="true"
        onChange={handleSelect}
        className="block w-full border rounded-lg p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
      />
      <p className="text-xs text-gray-500">
        💡 You can select one or multiple folders (Chrome only). Structify merges everything while preserving folder structure.
      </p>
    </div>
  );
}
