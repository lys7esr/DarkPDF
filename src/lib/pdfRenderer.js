import { pdfjsLib } from './pdfjsSetup.js';
import { detectImageRegions, dilateMask } from './regionDetector.js';

// Render a single PDF page to an OffscreenCanvas-style canvas at the
// requested scale, returning the canvas + ImageData.
export async function renderPageToCanvas(page, scale = 2) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  await page.render({ canvasContext: ctx, viewport }).promise;
  return { canvas, ctx, viewport };
}

// Run the full convert pipeline for a single page using a Web Worker.
export async function convertPage({
  page, scale, theme, brightness, contrast, worker
}) {
  const { canvas, ctx } = await renderPageToCanvas(page, scale);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Detect & dilate image-preserve mask
  const detected = detectImageRegions(imageData, 24);
  const { mask, cols, rows, blockSize } = dilateMask(detected, 1);

  // Hand work to worker
  const transformed = await runWorker(worker, {
    buffer: imageData.data.buffer,
    width: imageData.width,
    height: imageData.height,
    mask, cols, rows, blockSize,
    theme, brightness, contrast
  });

  const out = new ImageData(
    new Uint8ClampedArray(transformed),
    imageData.width,
    imageData.height
  );
  ctx.putImageData(out, 0, 0);
  return canvas;
}

function runWorker(worker, payload) {
  return new Promise((resolve, reject) => {
    const onMessage = (e) => {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      resolve(e.data.buffer);
    };
    const onError = (err) => {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      reject(err);
    };
    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    worker.postMessage(payload, [payload.buffer]);
  });
}

export async function loadPdf(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    // disable streaming for in-memory buffers
    disableAutoFetch: true,
    disableStream: true
  });
  return loadingTask.promise;
}