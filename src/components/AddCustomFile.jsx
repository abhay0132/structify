export default function AddCustomFile({ onAddOne: onAddBatch }) {
  function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fileObjs = files.map((f) => ({
      path: f.name,
      file: f,
    }));

    onAddBatch(fileObjs);
    e.target.value = "";
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor="customFileUpload"
        className="text-xs px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
      >
        ➕ Add Custom File(s)
      </label>
      <input
        id="customFileUpload"
        type="file"
        multiple
        className="hidden"
        onChange={handleUpload}
      />
      <p className="text-xs text-gray-500">
        Select one or more files manually — Structify will detect their likely folder
        (for example <b>utils/</b> or <b>components/</b>) based on your existing files.
      </p>
    </div>
  );
}
