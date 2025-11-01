import { buildTree, stringifyTree } from "./treeUtils";
import { normalizePath } from "./pathUtils";

function guessFence(path) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".tsx")) return "tsx";
  if (lower.endsWith(".ts")) return "ts";
  if (lower.endsWith(".jsx")) return "jsx";
  if (lower.endsWith(".js")) return "js";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".md")) return "md";
  return "";
}

export async function generateMarkdown(files) {
  // Normalize paths
  const allPaths = files.map((f) => normalizePath(f.path));
  const tree = stringifyTree(buildTree(allPaths));

  // Read both manual and picked files
  const contents = await Promise.all(
    files.map(async (f) => {
      let text = f.content || "";
      if (f.file) {
        text = await f.file.text();
      }
      return { relPath: f.path, text };
    })
  );

  // Build markdown output
  const markdown = [
    "# Project Structure",
    "",
    "```",
    tree.trim(),
    "```",
    "",
    ...contents.flatMap(({ relPath, text }) => [
      `## ${relPath}`,
      "",
      "```" + guessFence(relPath),
      text ? text.replaceAll("```", "```\\u200b") : "",
      "```",
      "",
    ]),
  ].join("\n");

  return { tree, markdown };
}
