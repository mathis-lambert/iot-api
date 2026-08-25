import Link from "next/link";
import { ChevronRight, MapPin, TimerReset } from "lucide-react";

import { DeviceAvatar } from "@/components/devices/device-avatar";
import { MetricPill } from "@/components/devices/metric-pill";
import { StatusBadge } from "@/components/devices/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DeviceView } from "@/features/devices/device.types";
import { timeAgo } from "@/lib/dates";

export function DeviceCard({ device }: { device: DeviceView }) {
  return (
    <Link
      href={`/devices/${encodeURIComponent(device.id)}`}
      className="group block no-underline"
    >
      <Card className="app-card lift py-0">
        <CardContent className="grid gap-5 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:p-5">
          <DeviceAvatar />

          <div className="min-w-0 space-y-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="truncate font-display text-xl font-semibold tracking-[-0.025em] text-ink">
                  {device.name}
                </h2>
                <StatusBadge status={device.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                <span className="font-mono text-xs font-semibold text-brand">{device.id}</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-ink-faint" />
                  {device.location}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {device.latestReadings.slice(0, 3).map((reading) => (
                <MetricPill key={reading.key} reading={reading} compact />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-ink-muted sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-ink-faint">
              <TimerReset className="size-3.5" />
              {timeAgo(device.lastSeenAt)}
            </span>
            <ChevronRight className="size-5 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-brand" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
