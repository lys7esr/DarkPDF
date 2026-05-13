export default function ProgressBar({ value, label }) {
  const pct = Math.round(value * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="text-xs font-mono text-slate-300">{pct}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-500 to-purple-500 transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}