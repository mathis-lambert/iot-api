import Link from "next/link";
import { ArrowLeft, Clock3, Cpu, MapPin, Network, Settings2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceAvatar } from "@/components/devices/device-avatar";
import { InfoList } from "@/components/devices/info-list";
import { MetricPill } from "@/components/devices/metric-pill";
import { RangeTabs } from "@/components/devices/range-tabs";
import { StatusBadge } from "@/components/devices/status-badge";
import { TelemetryChart } from "@/components/devices/telemetry-chart";
import type { DeviceView } from "@/features/devices/device.types";
import type { TelemetryRange, TelemetrySample } from "@/features/telemetry/telemetry.types";
import { formatDateTime, timeAgo } from "@/lib/dates";
import { formatDuration, formatInteger } from "@/lib/format";

export function DeviceDetailView({
  device,
  samples,
  range,
}: {
  device: DeviceView;
  samples: TelemetrySample[];
  range: TelemetryRange;
}) {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Appareils
        </Link>
      </Button>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="app-card">
          <CardContent className="grid gap-5 p-5 sm:grid-cols-[128px_1fr]">
            <DeviceAvatar />
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">{device.name}</h1>
                  <StatusBadge status={device.status} />
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{device.id}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-4" />
                    {device.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-4" />
                    {timeAgo(device.lastSeenAt)}
                  </span>
                </div>
              </div>
              <div className="grid metric-grid gap-3">
                {device.latestReadings.map((reading) => (
                  <MetricPill key={reading.key} reading={reading} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Identité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList
              rows={[
                ["Firmware", device.firmware],
                ["Première vue", formatDateTime(device.firstSeenAt)],
                ["Dernière synchro", formatDateTime(device.lastSeenAt)],
                ["IP publique", device.lastPublicIp ?? "N/A"],
              ]}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="app-card">
          <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Mesures</CardTitle>
            <RangeTabs deviceId={device.id} activeRange={range} />
          </CardHeader>
          <CardContent>
            <TelemetryChart samples={samples} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="size-4 text-primary" />
                Réseau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoList
                rows={[
                  ["SSID", device.network.ssid],
                  ["IP locale", device.network.local_ip],
                  ["API host", device.network.api_host],
                  ["API IP", device.network.api_ip],
                  ["Port", device.network.api_port],
                ]}
              />
            </CardContent>
          </Card>

          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="size-4 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoList
                rows={[
                  ["Intervalle d’envoi", `${Math.round(device.config.send_interval_ms / 60_000)} min`],
                  ["Retry", `${Math.round(device.config.retry_interval_ms / 60_000)} min`],
                  ["Offset température", valueOrNA(device.config.temperature_offset_c, " degC")],
                  ["Échantillons", device.config.sample_count ?? "N/A"],
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="app-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="size-4 text-primary" />
              Exécution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList
              rows={[
                ["Uptime", formatDuration(device.runtime.uptime_ms)],
                ["Séquence", formatInteger(device.runtime.sequence)],
                ["Succès", formatInteger(device.runtime.success_count)],
                ["Échecs", formatInteger(device.runtime.failure_count)],
                ["Reconnect Wi-Fi", formatInteger(device.runtime.wifi_reconnect_count)],
              ]}
            />
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardHeader>
            <CardTitle>Capteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList rows={Object.entries(device.sensors).map(([key, value]) => [humanizeKey(key), String(value)])} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function valueOrNA(value: unknown, suffix = "") {
  return typeof value === "number" ? `${value.toFixed(2)}${suffix}` : "N/A";
}

function humanizeKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
