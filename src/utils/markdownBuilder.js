import { buildTree, stringifyTree } from "./treeUtils";

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
  if (lower.endsWith(".py")) return "python";
  return "";
}

export async function generateMarkdown(files) {
  // Build tree
  const allPaths = files.map((f) => f.path);
  const tree = stringifyTree(buildTree(allPaths));

  // Read file contents
  const contents = await Promise.all(
    files.map(async (f) => {
      const text = await f.file.text();
      return { path: f.path, text };
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
    ...contents.flatMap(({ path, text }) => [
      `## ${path}`,
      "",
      "```" + guessFence(path),
      text,
      "```",
      "",
    ]),
  ].join("\n");

  return { tree, markdown };
}