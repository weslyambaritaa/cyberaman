import clsx from "clsx";

export function ProgressBar({
  value,
  max,
  colorClassName = "bg-emerald-500",
}: {
  value: number;
  max: number;
  colorClassName?: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={clsx("h-full rounded-full transition-all", colorClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
