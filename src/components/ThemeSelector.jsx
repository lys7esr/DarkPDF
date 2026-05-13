import { THEME_LIST } from '../lib/themes.js';

export default function ThemeSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
        Theme
      </label>
      <div className="grid grid-cols-2 gap-2">
        {THEME_LIST.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={[
                'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all',
                active
                  ? 'border-accent-400 bg-accent-500/10 shadow-glow'
                  : 'border-white/10 hover:border-white/25 bg-white/[0.02]'
              ].join(' ')}
            >
              <span
                className="w-6 h-6 rounded-lg border border-white/15 shrink-0"
                style={{ background: t.swatch }}
              />
              <span className="text-sm text-slate-200 truncate">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}