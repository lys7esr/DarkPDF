export default function Spinner({ size = 20 }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-white/20 border-t-accent-400"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}