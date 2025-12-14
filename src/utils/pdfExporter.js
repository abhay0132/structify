import html2pdf from "html2pdf.js";
import { marked } from "marked";

export function exportMarkdownToPDF(markdown) {
  // 1. Convert markdown → HTML
  const html = marked.parse(markdown);

  // 2. Create hidden container
  const container = document.createElement("div");
  container.style.padding = "24px";
  container.style.fontFamily = "monospace";
  container.style.fontSize = "12px";
  container.style.lineHeight = "1.5";
  container.innerHTML = `
    <h1>Structify Export</h1>
    <hr/>
    ${html}
  `;

  document.body.appendChild(container);

  // 3. Export to PDF
  html2pdf()
    .set({
      margin: 10,
      filename: "structify_export.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(container)
    .save()
    .then(() => {
      document.body.removeChild(container);
    });
}
