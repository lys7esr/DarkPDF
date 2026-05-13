import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import UploadZone from './components/UploadZone.jsx';
import ControlsPanel from './components/ControlsPanel.jsx';
import ComparisonView from './components/ComparisonView.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import { THEMES } from './lib/themes.js';
import { usePdfDocument } from './hooks/usePdfDocument.js';
import { useDarkConverter } from './hooks/useDarkConverter.js';
import { downloadBlob } from './lib/pdfBuilder.js';

export default function App() {
  const [file, setFile] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [themeId, setThemeId] = useState('amoled');
  const [brightness, setBrightness] = useState(1.0);
  const [contrast, setContrast] = useState(1.0);

  const { pdf, pageCount, loading: pdfLoading, error: pdfError } = usePdfDocument(file);
  const { convertAll, convertOne, progress, busy, error: convError } = useDarkConverter();

  useEffect(() => { setPageNum(1); }, [file]);

  const theme = useMemo(() => THEMES[themeId], [themeId]);

  const options = useMemo(
    () => ({ theme, themeId, brightness, contrast }),
    [theme, themeId, brightness, contrast]
  );

  const handleConvert = useCallback(async () => {
    if (!pdf) return;
    const bytes = await convertAll(pdf, { ...options, scale: 2 });
    if (bytes) {
      const baseName = file?.name?.replace(/\.pdf$/i, '') || 'document';
      downloadBlob(bytes, `${baseName}-dark.pdf`);
    }
  }, [pdf, convertAll, options, file]);

  const handleReset = useCallback(() => setFile(null), []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (!pdf) return;
      if (e.key === 'ArrowRight') setPageNum((p) => Math.min(p + 1, pageCount));
      else if (e.key === 'ArrowLeft') setPageNum((p) => Math.max(p - 1, 1));
      else if ((e.key === 'Enter' || e.key === 'd') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleConvert();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pdf, pageCount, handleConvert]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-5 sm:px-8 py-10 sm:py-16 max-w-7xl w-full mx-auto">
        {!file && (
          <Hero>
            <UploadZone onFile={setFile} />
          </Hero>
        )}

        {file && (
          <section className="animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-8">
              <ControlsPanel
                themeId={themeId} setThemeId={setThemeId}
                brightness={brightness} setBrightness={setBrightness}
                contrast={contrast} setContrast={setContrast}
                onConvert={handleConvert}
                onReset={handleReset}
                busy={busy}
                ready={!!pdf}
              />

              <div className="flex-1 min-w-0 space-y-5">
                <FileMeta file={file} pages={pageCount} loading={pdfLoading} />
                {pdfError && <ErrorBox>{pdfError}</ErrorBox>}
                {convError && <ErrorBox>{convError}</ErrorBox>}
                {busy && (
                  <ProgressBar value={progress} label="Converting pages" />
                )}
                {pdf && (
                  <ComparisonView
                    pdf={pdf}
                    pageNum={pageNum}
                    setPageNum={setPageNum}
                    convertOne={convertOne}
                    options={options}
                  />
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Hero({ children }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-6 animate-fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
        100% private · runs in your browser
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-5 leading-[1.05] animate-slide-up">
        Read PDFs in <span className="bg-gradient-to-r from-accent-400 to-purple-400 bg-clip-text text-transparent">comfortable dark mode</span>
      </h1>
      <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl mx-auto animate-slide-up">
        Smart conversion that preserves images, charts, and colours — not a crude inversion.
      </p>
      {children}
    </div>
  );
}

function FileMeta({ file, pages, loading }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="min-w-0 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent-500/15 grid place-items-center text-accent-400 shrink-0">
          PDF
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
          <p className="text-xs text-slate-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
            {pages ? ` · ${pages} page${pages > 1 ? 's' : ''}` : loading ? ' · loading…' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ children }) {
  return (
    <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
      {children}
    </div>
  );
}