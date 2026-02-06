export default function AddCustomFile({ onAddOne }) {
  function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const fileObjs = files.map((f) => ({
      path: f.name,
      file: f,
    }));

    onAddOne(fileObjs);
    e.target.value = "";
  }

  return (
    <>
      <label htmlFor="customFileInput">
        <button
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("customFileInput").click();
          }}
        >
          Add files manually
        </button>
      </label>
      <input
        id="customFileInput"
        type="file"
        multiple
        onChange={handleUpload}
        style={{ display: "none" }}
      />
    </>
  );
}