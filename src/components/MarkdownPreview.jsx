export default function MarkdownPreview({
  markdown,
  onCopy,
  onDownload,
  onExportPDF,
}) {
  return (
    <section className="w-full h-full border rounded-xl bg-white shadow-sm relative flex flex-col">
      <div className="px-4 pt-3 pb-2 border-b">
        <h3 className="font-medium text-sm">🧾 Combined Markdown</h3>
      </div>

      <div className="flex-1 overflow-auto text-xs whitespace-pre-wrap font-mono bg-gray-50 px-4 py-3">
        {markdown || "— no markdown yet —"}
      </div>

      <div className="absolute bottom-3 right-4 flex gap-2">
        <button disabled={!markdown} onClick={() => onCopy(markdown)}>
          Copy
        </button>
        <button disabled={!markdown} onClick={() => onDownload("structify_export.md", markdown)}>
          .md
        </button>
        <button disabled={!markdown} onClick={onExportPDF}>
          PDF
        </button>
      </div>
    </section>
  );
}
