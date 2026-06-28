import Link from "next/link";
import { ChevronRight, MapPin, TimerReset } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DeviceAvatar } from "@/components/devices/device-avatar";
import { MetricPill } from "@/components/devices/metric-pill";
import { StatusBadge } from "@/components/devices/status-badge";
import type { DeviceView } from "@/features/devices/device.types";
import { timeAgo } from "@/lib/dates";

export function DeviceCard({ device }: { device: DeviceView }) {
  return (
    <Link href={`/devices/${encodeURIComponent(device.id)}`} className="block">
      <Card className="app-card py-0 transition hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="grid gap-5 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
          <DeviceAvatar />
          <div className="min-w-0 space-y-3">
            <div className="space-y-1">
              <h2 className="truncate text-xl font-semibold">{device.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="font-medium text-primary">{device.id}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {device.location}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={device.status} />
              {device.latestReadings.slice(0, 3).map((reading) => (
                <MetricPill key={reading.key} reading={reading} compact />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground sm:justify-end">
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-2">
              <TimerReset className="size-4" />
              {timeAgo(device.lastSeenAt)}
            </span>
            <ChevronRight className="size-5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
