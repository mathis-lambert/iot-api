"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MetricReading, TelemetrySample } from "@/features/telemetry/telemetry.types";
import { formatTime } from "@/lib/dates";

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function TelemetryChart({ samples }: { samples: TelemetrySample[] }) {
  const groups = buildMetricGroups(samples);

  if (samples.length === 0 || groups.length === 0) {
    return (
      <div className="grid h-72 place-items-center rounded-[1rem] border border-dashed border-line bg-paper-sink text-sm text-ink-muted">
        Aucune mesure sur cette période.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="t-eyebrow t-eyebrow-brand">{group.id}</p>
              <h3 className="mt-1 font-display text-base font-semibold text-ink">{group.title}</h3>
            </div>
            <p className="t-meta">{group.unitLabel}</p>
          </div>
          <div className="chart-surface">
            <MetricLineChart samples={samples} metricKeys={group.keys} />
          </div>
        </section>
      ))}
    </div>
  );
}

function MetricLineChart({
  samples,
  metricKeys,
}: {
  samples: TelemetrySample[];
  metricKeys: string[];
}) {
  const labels = new Map(
    samples.flatMap((sample) => sample.readings.map((reading) => [reading.key, reading.label])),
  );
  const config = Object.fromEntries(
    metricKeys.map((key, index) => [
      key,
      { label: labels.get(key) ?? key, color: palette[index % palette.length] },
    ]),
  ) satisfies ChartConfig;

  const data = samples.map((sample) => ({
    time: formatTime(sample.receivedAt),
    receivedAt: sample.receivedAt,
    ...Object.fromEntries(
      sample.readings
        .filter((reading) => metricKeys.includes(reading.key))
        .map((reading) => [reading.key, reading.value]),
    ),
  }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={44} domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {metricKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={index < 3}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

function buildMetricGroups(samples: TelemetrySample[]) {
  const readings = samples.flatMap((sample) => sample.readings);
  const allKeys = unique(readings.map((reading) => reading.key));
  const pressureKeys = allKeys.filter((key) => isPressure(readings.find((reading) => reading.key === key)));
  const otherKeys = allKeys.filter((key) => !pressureKeys.includes(key));

  return [
    otherKeys.length
      ? {
          id: "environment",
          title: "Température et humidité",
          unitLabel: unitSummary(readings, otherKeys),
          keys: otherKeys,
        }
      : null,
    pressureKeys.length
      ? {
          id: "pressure",
          title: "Pression",
          unitLabel: unitSummary(readings, pressureKeys),
          keys: pressureKeys,
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; title: string; unitLabel: string; keys: string[] }>;
}

function isPressure(reading?: MetricReading) {
  return Boolean(reading && (reading.key.includes("pressure") || reading.unit === "hPa"));
}

function unitSummary(readings: MetricReading[], keys: string[]) {
  const units = unique(
    keys
      .map((key) => readings.find((reading) => reading.key === key)?.unit)
      .filter((unit): unit is string => Boolean(unit)),
  );
  return units.join(" / ");
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}
