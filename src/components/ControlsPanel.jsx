import ThemeSelector from './ThemeSelector.jsx';

export default function ControlsPanel({
  themeId, setThemeId,
  brightness, setBrightness,
  contrast, setContrast,
  onConvert, onReset, busy, ready
}) {
  return (
    <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 self-start space-y-6 p-5 rounded-2xl bg-ink-800/60 border border-white/10 backdrop-blur">
      <ThemeSelector value={themeId} onChange={setThemeId} />

      <Slider
        label="Brightness"
        min={0.6} max={1.4} step={0.02}
        value={brightness}
        onChange={setBrightness}
        format={(v) => `${Math.round(v * 100)}%`}
      />

      <Slider
        label="Contrast"
        min={0.7} max={1.4} step={0.02}
        value={contrast}
        onChange={setContrast}
        format={(v) => `${Math.round(v * 100)}%`}
      />

      <div className="space-y-2 pt-2">
        <button
          onClick={onConvert}
          disabled={busy || !ready}
          className="w-full px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-accent-500 to-purple-500 hover:brightness-110 active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-glow"
        >
          {busy ? 'Converting…' : 'Convert & Download'}
        </button>
        <button
          onClick={onReset}
          disabled={busy}
          className="w-full px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white border border-white/10 hover:border-white/25 transition-colors disabled:opacity-40"
        >
          Upload another file
        </button>
      </div>
    </aside>
  );
}

function Slider({ label, min, max, step, value, onChange, format }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </label>
        <span className="text-xs font-mono text-slate-300">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-accent-500"
      />
    </div>
  );
}