import { useEffect, useRef, useState } from 'react';
import { renderPageToCanvas } from '../lib/pdfRenderer.js';
import Spinner from './Spinner.jsx';

// Lazy renders only the current page of a PDF document.
export default function PdfPreview({ pdf, pageNum, onPageChange, label }) {
  const containerRef = useRef(null);
  const [canvasUrl, setCanvasUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    let cancelled = false;
    if (!pdf) return;
    setLoading(true);

    (async () => {
      const page = await pdf.getPage(pageNum);
      const { canvas } = await renderPageToCanvas(page, 1.5);
      if (cancelled) return;
      const url = canvas.toDataURL('image/png');
      setCanvasUrl(url);
      setSize({ w: canvas.width, h: canvas.height });
      setLoading(false);
      page.cleanup();
    })().catch(() => setLoading(false));

    return () => { cancelled = true; };
  }, [pdf, pageNum]);

  if (!pdf) return null;
  const total = pdf.numPages;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <NavBtn disabled={pageNum <= 1} onClick={() => onPageChange(pageNum - 1)}>‹</NavBtn>
          <span className="text-xs font-mono text-slate-300 px-2">
            {pageNum} / {total}
          </span>
          <NavBtn disabled={pageNum >= total} onClick={() => onPageChange(pageNum + 1)}>›</NavBtn>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden bg-ink-900 border border-white/10 shadow-soft"
        style={{ aspectRatio: size.w && size.h ? `${size.w} / ${size.h}` : '1 / 1.4142' }}
      >
        {loading && (
          <div className="absolute inset-0 grid place-items-center">
            <Spinner size={28} />
          </div>
        )}
        {canvasUrl && (
          <img
            src={canvasUrl}
            alt={`Page ${pageNum}`}
            className="w-full h-full object-contain animate-fade-in"
            draggable={false}
          />
        )}
      </div>
    </div>
  );
}

function NavBtn({ children, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-md grid place-items-center text-slate-300 hover:text-white border border-white/10 hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}