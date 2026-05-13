export default function Header() {
  return (
    <header className="w-full px-5 sm:px-8 py-5 flex items-center justify-between border-b border-white/5 bg-ink-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center shadow-glow">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">DarkPDF</h1>
          <p className="text-xs text-slate-400 -mt-0.5">Eye-friendly PDFs in one click</p>
        </div>
      </div>
      <a
        href="https://github.com/lys7esr/DarkPDF.git"
        target="_blank"
        rel="noreferrer"
        className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25"
      >
        <span>★ Star</span>
      </a>
    </header>
  );
}