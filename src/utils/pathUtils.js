export function normalizePath(p) {
  return (p || "").replaceAll("\\", "/");
}

export function getDirname(p) {
  const norm = (p || "").replaceAll("\\", "/");
  if (!norm.includes("/")) return "";
  return norm.split("/").slice(0, -1).join("/");
}

export function findCommonFolderPath(paths) {
  const split = paths
    .map(normalizePath)
    .map((p) => p.split("/").slice(0, -1))
    .filter((parts) => parts.length > 0);
  if (!split.length) return "";
  const minLen = Math.min(...split.map((a) => a.length));
  const out = [];
  for (let i = 0; i < minLen; i++) {
    const seg = split[0][i];
    if (split.every((a) => a[i] === seg)) out.push(seg);
    else break;
  }
  return out.join("/");
}

/**
 * 🧠 Infer the most logical folder for a new batch of files
 * based on extension frequency and existing project structure.
 */
export function inferFolderForBatch(newFiles, existingFiles) {
  if (!newFiles.length) return "";

  // 1️⃣ Get dominant extension type in this batch
  const exts = newFiles.map((f) => f.name.split(".").pop().toLowerCase());
  const extCount = exts.reduce((acc, e) => {
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  const mainExt = Object.entries(extCount).sort((a, b) => b[1] - a[1])[0][0]; // most frequent extension

  // 2️⃣ Find any existing folder in current files with same extension
  const similar = existingFiles.filter((f) =>
    f.path.toLowerCase().endsWith("." + mainExt)
  );
  if (similar.length) {
    const lastSimilar = similar[similar.length - 1];
    const folder = getDirname(lastSimilar.path);
    if (folder) return folder;
  }

  // 3️⃣ Fallback: try common folder among all existing files
  const fallback = findCommonFolderPath(existingFiles.map((f) => f.path));
  if (fallback) return fallback;

  // 4️⃣ Last resort — create a new generic folder
  return `inferred-${mainExt}`;
}
