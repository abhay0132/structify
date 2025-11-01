export default function MarkdownPreview({ markdown, onCopy, onDownload }) {
  return (
    <section className="p-4 rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm">Combined Markdown</h3>
        <div className="flex gap-2">
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-100"
            disabled={!markdown}
            onClick={() => onCopy(markdown)}
          >
            Copy
          </button>
          <button
            className="text-xs px-2 py-1 rounded border hover:bg-gray-100"
            disabled={!markdown}
            onClick={() => onDownload("structify_export.md", markdown)}
          >
            Download
          </button>
        </div>
      </div>
      <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-80">
        {markdown || "— no markdown yet —"}
      </pre>
    </section>
  );
}
