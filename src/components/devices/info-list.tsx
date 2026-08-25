import type React from "react";

export function InfoList({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <dl className="divide-y divide-line">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-sm">
          <dt className="data-label self-center">{label}</dt>
          <dd className="data-value max-w-[180px] truncate text-right sm:max-w-xs">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
