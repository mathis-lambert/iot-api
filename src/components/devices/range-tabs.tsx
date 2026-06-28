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

export function RangeTabs({ deviceId, activeRange }: { deviceId: string; activeRange: TelemetryRange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((range) => {
        const active = activeRange === range.value;

        return (
          <Button
            key={range.value}
            asChild
            size="sm"
            variant={active ? "default" : "outline"}
            className="min-w-12"
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
