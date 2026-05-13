import { useCallback, useRef, useState } from 'react';

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB

export default function UploadZone({ onFile }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback((file) => {
    setError(null);
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File is too large (max 200 MB).');
      return;
    }
    onFile(file);
  }, [onFile]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        className={[
          'relative rounded-3xl border-2 border-dashed transition-all duration-300',
          'px-6 sm:px-12 py-14 sm:py-20 text-center cursor-pointer select-none',
          'bg-gradient-to-b from-ink-800/70 to-ink-900/70 backdrop-blur',
          drag
            ? 'border-accent-400 shadow-glow scale-[1.01]'
            : 'border-white/10 hover:border-white/25 hover:shadow-soft'
        ].join(' ')}
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-accent-400">
            <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          Drop your PDF here
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          or <span className="text-accent-400 font-medium">click to browse</span> — up to 200 MB
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
          <Tag>🔒 Private</Tag>
          <Tag>⚡ In-browser</Tag>
          <Tag>🆓 Free forever</Tag>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p className="mt-4 text-sm text-red-400 text-center animate-fade-in">{error}</p>
      )}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
      {children}
    </span>
  );
}