export default function TreePreview({ tree }) {
  return (
    <section className="p-4 rounded-2xl border bg-white shadow-sm">
      <h3 className="font-medium mb-2 text-sm">📂 Project Tree</h3>
      <pre className="text-xs whitespace-pre overflow-auto max-h-80">
        {tree || "— no tree yet —"}
      </pre>
    </section>
  );
}
