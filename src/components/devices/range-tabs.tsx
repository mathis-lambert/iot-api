import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { TelemetryRange } from "@/features/telemetry/telemetry.types";

const ranges: Array<{ value: TelemetryRange; label: string }> = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7j" },
  { value: "30d", label: "30j" },
];

export function RangeTabs({
  deviceId,
  activeRange,
}: {
  deviceId: string;
  activeRange: TelemetryRange;
}) {
  return (
    <div className="flex w-fit flex-wrap gap-1 rounded-full border border-line bg-paper-sink p-1">
      {ranges.map((range) => {
        const active = activeRange === range.value;

        return (
          <Button
            key={range.value}
            asChild
            size="sm"
            variant={active ? "default" : "ghost"}
            className={`min-w-10 rounded-full px-3 font-mono text-[0.65rem] uppercase tracking-wider ${active ? "" : "text-ink-muted"}`}
            aria-current={active ? "page" : undefined}
          >
            <Link
              href={`/devices/${encodeURIComponent(deviceId)}?range=${range.value}`}
              scroll={false}
              prefetch={false}
            >
              {range.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
