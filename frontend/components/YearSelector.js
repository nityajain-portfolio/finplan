export default function YearSelector({ year, onChange }) {
  const years = [2023, 2024, 2025];
  return (
    <div className="flex gap-1 bg-navy rounded-xl p-1">
      {years.map(y => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            year === y
              ? 'bg-teal text-white'
              : 'text-[var(--muted)] hover:text-white'
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}
