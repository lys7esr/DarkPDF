import { PDFDocument } from 'pdf-lib';

// Assembles converted page canvases into a single PDF.
// Each page is embedded as a JPEG to keep file size reasonable
// while preserving image quality.
export async function buildPdfFromCanvases(canvases, { jpegQuality = 0.92 } = {}) {
  const pdf = await PDFDocument.create();

  for (const canvas of canvases) {
    const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
    const bytes = dataUrlToUint8Array(dataUrl);
    const img = await pdf.embedJpg(bytes);

    // Use the canvas's pixel dimensions but at 72 dpi → match a
    // reasonable physical page (canvas was rendered at scale=2 of
    // the PDF's native viewport, so divide by 2 to get points).
    const pageWidth = canvas.width / 2;
    const pageHeight = canvas.height / 2;

    const page = pdf.addPage([pageWidth, pageHeight]);
    page.drawImage(img, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  }

  return pdf.save();
}

function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const len = binary.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export function downloadBlob(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}