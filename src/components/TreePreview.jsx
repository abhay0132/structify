export default function TreePreview({ tree }) {
  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="output-title">Tree</div>
      </div>
      <div className="output-content">
        <pre className="tree-view">{tree || "No tree yet"}</pre>
      </div>
    </div>
  );
}