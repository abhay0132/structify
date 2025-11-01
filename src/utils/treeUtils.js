import { normalizePath } from "./pathUtils";

export function buildTree(paths) {
  const tree = {};
  for (const p of paths) {
    const parts = normalizePath(p).split("/");
    let node = tree;
    for (const part of parts) {
      node[part] = node[part] || {};
      node = node[part];
    }
  }
  return tree;
}

export function stringifyTree(tree, level = 0) {
  const entries = Object.entries(tree);
  entries.sort((a, b) => {
    const aIsDir = Object.keys(a[1]).length > 0;
    const bIsDir = Object.keys(b[1]).length > 0;
    if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
    return a[0].localeCompare(b[0]);
  });
  let out = "";
  entries.forEach(([name, child], idx) => {
    const last = idx === entries.length - 1;
    out += `${"  ".repeat(level)}${last ? "└─" : "├─"} ${name}\n`;
    if (Object.keys(child).length > 0) {
      out += stringifyTree(child, level + 1);
    }
  });
  return out;
}
