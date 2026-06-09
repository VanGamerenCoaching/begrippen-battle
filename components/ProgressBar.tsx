type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      aria-label={`Voortgang ${current} van ${total}`}
    >
      <div className="mb-2 flex items-center justify-between text-sm font-black text-slate-600">
        <span>Voortgang</span>
        <span>
          Vraag {Math.min(current, total)} van {total} - {percentage}%
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-lg border border-teal-100 bg-white">
        <div
          className="h-full rounded-lg bg-ocean transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
