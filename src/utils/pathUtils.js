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

export function inferFolderForBatch(newFiles, existingFiles) {
  if (!newFiles.length) return "";

  const exts = newFiles.map((f) => f.name.split(".").pop().toLowerCase());
  const extCount = exts.reduce((acc, e) => {
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  const mainExt = Object.entries(extCount).sort((a, b) => b[1] - a[1])[0][0];

  const similar = existingFiles.filter((f) =>
    f.path.toLowerCase().endsWith("." + mainExt)
  );
  if (similar.length) {
    const lastSimilar = similar[similar.length - 1];
    const folder = getDirname(lastSimilar.path);
    if (folder) return folder;
  }

  const fallback = findCommonFolderPath(existingFiles.map((f) => f.path));
  if (fallback) return fallback;

  return `inferred-${mainExt}`;
}