import type React from "react";

export function InfoList({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <dl className="divide-y">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[1fr_auto] gap-4 py-2 text-sm">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="max-w-[180px] truncate text-right font-medium text-foreground sm:max-w-xs">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
