import { Droplets, Gauge, Thermometer, Waves } from "lucide-react";
import type { MetricReading } from "@/features/telemetry/telemetry.types";
import { formatNumber } from "@/lib/format";

function MetricIcon({ metricKey }: { metricKey: string }) {
  if (metricKey.includes("temperature")) return <Thermometer className="size-4 shrink-0" />;
  if (metricKey.includes("humidity")) return <Droplets className="size-4 shrink-0" />;
  if (metricKey.includes("pressure")) return <Gauge className="size-4 shrink-0" />;
  return <Waves className="size-4 shrink-0" />;
}

function metricTone(key: string) {
  if (key.includes("temperature")) {
    return "border-blue-200/70 bg-blue-50 text-blue-800 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200";
  }
  if (key.includes("humidity")) {
    return "border-cyan-200/70 bg-cyan-50 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200";
  }
  if (key.includes("pressure")) {
    return "border-amber-200/70 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200";
  }
  return "border-violet-200/70 bg-violet-50 text-violet-800 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200";
}

export function MetricPill({ reading, compact = false }: { reading: MetricReading; compact?: boolean }) {
  return (
    <div className={`inline-flex min-w-0 items-center gap-2 rounded-lg border px-3 py-2 ${metricTone(reading.key)}`}>
      <MetricIcon metricKey={reading.key} />
      <span className="truncate text-sm font-medium">
        {formatNumber(reading.value, reading.unit === "%" ? 0 : 1)}
        {reading.unit ? ` ${reading.unit}` : ""}
      </span>
      {!compact ? <span className="hidden truncate text-xs opacity-70 sm:inline">{reading.label}</span> : null}
    </div>
  );
}
