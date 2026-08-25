import Link from "next/link";
import { ArrowLeft, Clock3, Cpu, MapPin, Network, Settings2, ShieldCheck } from "lucide-react";

import { DeviceAvatar } from "@/components/devices/device-avatar";
import { InfoList } from "@/components/devices/info-list";
import { MetricPill } from "@/components/devices/metric-pill";
import { RangeTabs } from "@/components/devices/range-tabs";
import { StatusBadge } from "@/components/devices/status-badge";
import { TelemetryChart } from "@/components/devices/telemetry-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-ink-muted hover:bg-paper-sink hover:text-ink">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Tous les appareils
          </Link>
        </Button>
        <p className="t-meta">Device / {device.id}</p>
      </div>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <Card className="app-card">
          <CardContent className="grid gap-6 p-5 sm:grid-cols-[7rem_1fr] sm:p-7">
            <DeviceAvatar />
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="section-kicker t-eyebrow t-eyebrow-brand">Connected node / overview</p>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="t-h2">{device.name}</h1>
                  <StatusBadge status={device.status} />
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
                  <span className="font-mono text-xs font-semibold text-brand">{device.id}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-ink-faint" />
                    {device.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-ink-faint" />
                    {timeAgo(device.lastSeenAt)}
                  </span>
                </div>
              </div>
              <div className="grid metric-grid gap-2.5">
                {device.latestReadings.map((reading) => (
                  <MetricPill key={reading.key} reading={reading} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardHeader className="gap-2">
            <p className="t-eyebrow">Identity / trust</p>
            <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
              <ShieldCheck className="size-4 text-brand" />
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

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <Card className="app-card">
          <CardHeader className="gap-4 border-b border-line sm:flex sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="t-eyebrow t-eyebrow-brand">Observability / telemetry</p>
              <CardTitle className="mt-2 font-display text-xl font-semibold">Mesures</CardTitle>
            </div>
            <RangeTabs deviceId={device.id} activeRange={range} />
          </CardHeader>
          <CardContent className="pt-5">
            <TelemetryChart samples={samples} />
          </CardContent>
        </Card>

        <div className="space-y-5">
          <InfoCard
            icon={Network}
            eyebrow="Connectivity / network"
            title="Réseau"
            rows={[
              ["SSID", device.network.ssid],
              ["IP locale", device.network.local_ip],
              ["API host", device.network.api_host],
              ["API IP", device.network.api_ip],
              ["Port", device.network.api_port],
            ]}
          />
          <InfoCard
            icon={Settings2}
            eyebrow="Runtime / configuration"
            title="Configuration"
            rows={[
              ["Intervalle d’envoi", `${Math.round(device.config.send_interval_ms / 60_000)} min`],
              ["Retry", `${Math.round(device.config.retry_interval_ms / 60_000)} min`],
              ["Offset température", valueOrNA(device.config.temperature_offset_c, " degC")],
              ["Échantillons", device.config.sample_count ?? "N/A"],
            ]}
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <InfoCard
          icon={Cpu}
          eyebrow="Runtime / execution"
          title="Exécution"
          rows={[
            ["Uptime", formatDuration(device.runtime.uptime_ms)],
            ["Séquence", formatInteger(device.runtime.sequence)],
            ["Succès", formatInteger(device.runtime.success_count)],
            ["Échecs", formatInteger(device.runtime.failure_count)],
            ["Reconnect Wi-Fi", formatInteger(device.runtime.wifi_reconnect_count)],
          ]}
        />
        <Card className="app-card">
          <CardHeader className="gap-2">
            <p className="t-eyebrow">Sensors / payload</p>
            <CardTitle className="font-display text-lg font-semibold">Capteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoList rows={Object.entries(device.sensors).map(([key, value]) => [humanizeKey(key), String(value)])} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  eyebrow,
  title,
  rows,
}: {
  icon: typeof Network;
  eyebrow: string;
  title: string;
  rows: Array<[string, React.ReactNode]>;
}) {
  return (
    <Card className="app-card">
      <CardHeader className="gap-2">
        <p className="t-eyebrow">{eyebrow}</p>
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
          <Icon className="size-4 text-brand" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InfoList rows={rows} />
      </CardContent>
    </Card>
  );
}

function valueOrNA(value: unknown, suffix = "") {
  return typeof value === "number" ? `${value.toFixed(2)}${suffix}` : "N/A";
}

function humanizeKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
