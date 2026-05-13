import { useEffect, useState } from 'react';
import PdfPreview from './PdfPreview.jsx';
import Spinner from './Spinner.jsx';

// Renders side-by-side: original PDF (left) and theme-previewed
// single page rendered live (right).
export default function ComparisonView({
  pdf, pageNum, setPageNum,
  convertOne, options
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!pdf) return;
    setLoading(true);
    setPreviewUrl(null);

    convertOne(pdf, pageNum, { ...options, scale: 1.5 })
      .then((canvas) => {
        if (cancelled || !canvas) return;
        setPreviewUrl(canvas.toDataURL('image/png'));
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [pdf, pageNum, convertOne, options.themeId, options.brightness, options.contrast]);

  return (
    <div className="grid md:grid-cols-2 gap-5 w-full">
      <PdfPreview
        pdf={pdf}
        pageNum={pageNum}
        onPageChange={setPageNum}
        label="Original"
      />
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center justify-between w-full mb-3 px-1">
          <span className="text-xs font-medium uppercase tracking-wider text-accent-400">
            Dark mode preview
          </span>
        </div>
        <div className="relative w-full rounded-xl overflow-hidden bg-ink-900 border border-accent-500/30 shadow-glow"
             style={{ aspectRatio: '1 / 1.4142' }}>
          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-ink-900/80 backdrop-blur-sm z-10">
              <Spinner size={28} />
            </div>
          )}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Dark preview"
              className="w-full h-full object-contain animate-fade-in"
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}