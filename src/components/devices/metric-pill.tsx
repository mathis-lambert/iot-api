import { Droplets, Gauge, Thermometer, Waves } from "lucide-react";

import type { MetricReading } from "@/features/telemetry/telemetry.types";
import { formatNumber } from "@/lib/format";

function MetricIcon({ metricKey }: { metricKey: string }) {
  if (metricKey.includes("temperature")) return <Thermometer className="size-4 shrink-0" />;
  if (metricKey.includes("humidity")) return <Droplets className="size-4 shrink-0" />;
  if (metricKey.includes("pressure")) return <Gauge className="size-4 shrink-0" />;
  return <Waves className="size-4 shrink-0" />;
}

export function MetricPill({
  reading,
  compact = false,
}: {
  reading: MetricReading;
  compact?: boolean;
}) {
  return (
    <div className={`metric-pill ${compact ? "py-1.5" : ""}`}>
      <MetricIcon metricKey={reading.key} />
      <span className="truncate font-mono text-xs font-semibold">
        {formatNumber(reading.value, reading.unit === "%" ? 0 : 1)}
        {reading.unit ? ` ${reading.unit}` : ""}
      </span>
      {!compact ? (
        <span className="hidden truncate text-[0.65rem] font-medium opacity-70 sm:inline">
          {reading.label}
        </span>
      ) : null}
    </div>
  );
}
