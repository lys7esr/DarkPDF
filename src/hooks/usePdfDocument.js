import { useEffect, useRef, useState } from 'react';
import { loadPdf } from '../lib/pdfRenderer.js';

export function usePdfDocument(file) {
  const [pdf, setPdf] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastDoc = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (!file) {
      setPdf(null);
      setPageCount(0);
      return;
    }

    setLoading(true);
    setError(null);
    file.arrayBuffer()
      .then(loadPdf)
      .then((doc) => {
        if (cancelled) return;
        if (lastDoc.current) lastDoc.current.destroy?.();
        lastDoc.current = doc;
        setPdf(doc);
        setPageCount(doc.numPages);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load PDF.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [file]);

  useEffect(() => () => lastDoc.current?.destroy?.(), []);

  return { pdf, pageCount, error, loading };
}