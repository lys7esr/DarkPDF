import { useCallback, useEffect, useRef, useState } from 'react';
import { convertPage } from '../lib/pdfRenderer.js';
import { buildPdfFromCanvases } from '../lib/pdfBuilder.js';

export function useDarkConverter() {
  const workerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/pixelTransform.worker.js', import.meta.url),
      { type: 'module' }
    );
    return () => workerRef.current?.terminate();
  }, []);

  const convertAll = useCallback(async (pdf, options) => {
    if (!pdf || !workerRef.current) return null;
    setBusy(true);
    setError(null);
    setProgress(0);

    try {
      const canvases = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const canvas = await convertPage({
          page,
          scale: options.scale,
          theme: options.theme,
          brightness: options.brightness,
          contrast: options.contrast,
          worker: workerRef.current
        });
        canvases.push(canvas);
        setProgress(i / pdf.numPages);
        page.cleanup();
      }

      const bytes = await buildPdfFromCanvases(canvases, { jpegQuality: 0.92 });
      return bytes;
    } catch (err) {
      setError(err.message || 'Conversion failed.');
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const convertOne = useCallback(async (pdf, pageNum, options) => {
    if (!pdf || !workerRef.current) return null;
    const page = await pdf.getPage(pageNum);
    const canvas = await convertPage({
      page,
      scale: options.scale,
      theme: options.theme,
      brightness: options.brightness,
      contrast: options.contrast,
      worker: workerRef.current
    });
    page.cleanup();
    return canvas;
  }, []);

  return { convertAll, convertOne, progress, busy, error };
}