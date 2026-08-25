"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MetricReading, TelemetrySample } from "@/features/telemetry/telemetry.types";

const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;
const tickSteps = [15 * minute, 30 * minute, hour, 2 * hour, 4 * hour, 6 * hour, 12 * hour, day, 2 * day, 3 * day, 7 * day];

const axisTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});
const axisDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
const axisDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
});
const tooltipDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function TelemetryChart({ samples }: { samples: TelemetrySample[] }) {
  const orderedSamples = orderSamples(samples);
  const groups = buildMetricGroups(orderedSamples);

  if (orderedSamples.length === 0 || groups.length === 0) {
    return (
      <div className="grid h-72 place-items-center rounded-[1rem] border border-dashed border-line bg-paper-sink text-sm text-ink-muted">
        Aucune mesure sur cette période.
      </div>
    );
  }

  const chartSamples = downsampleSamples(orderedSamples, 1_400);

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
            <MetricLineChart samples={chartSamples} metricKeys={group.keys} />
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
    timestamp: new Date(sample.receivedAt).getTime(),
    ...Object.fromEntries(
      sample.readings
        .filter((reading) => metricKeys.includes(reading.key))
        .map((reading) => [reading.key, reading.value]),
    ),
  }));
  const timestamps = data.map((sample) => sample.timestamp).filter(Number.isFinite);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  const span = maxTimestamp - minTimestamp;
  const ticks = buildTimeTicks(minTimestamp, maxTimestamp);

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          type="number"
          dataKey="timestamp"
          domain={[minTimestamp, maxTimestamp]}
          ticks={ticks}
          tickFormatter={(value) => formatAxisTick(value, span)}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          minTickGap={28}
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={44}
          domain={["auto", "auto"]}
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--brand-quiet)", strokeDasharray: "4 4" }}
          content={<ChartTooltipContent labelFormatter={(value) => formatTooltipDate(value)} />}
        />
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

function orderSamples(samples: TelemetrySample[]) {
  return [...samples].sort(
    (left, right) => new Date(left.receivedAt).getTime() - new Date(right.receivedAt).getTime(),
  );
}

function downsampleSamples(samples: TelemetrySample[], maxPoints: number) {
  if (samples.length <= maxPoints) return samples;

  return Array.from({ length: maxPoints }, (_, index) => {
    const sourceIndex = Math.round((index * (samples.length - 1)) / (maxPoints - 1));
    return samples[sourceIndex];
  });
}

function buildTimeTicks(minTimestamp: number, maxTimestamp: number) {
  const span = maxTimestamp - minTimestamp;
  if (!Number.isFinite(span) || span <= 0) return [minTimestamp];

  const targetStep = span >= 2 * day ? Math.max(span / 6, day) : span / 6;
  const step = tickSteps.find((candidate) => candidate >= targetStep) ?? 14 * day;
  const ticks = [minTimestamp];

  for (
    let tick = Math.ceil(minTimestamp / step) * step;
    tick < maxTimestamp && ticks.length < 8;
    tick += step
  ) {
    if (tick > minTimestamp) ticks.push(tick);
  }

  if (ticks[ticks.length - 1] !== maxTimestamp) ticks.push(maxTimestamp);
  return ticks;
}

function formatAxisTick(value: string | number, span: number) {
  const date = new Date(Number(value));
  if (span >= 2 * day) return axisDateFormatter.format(date).replace(".", "");
  if (span > day) return axisDateTimeFormatter.format(date);
  return axisTimeFormatter.format(date);
}

function formatTooltipDate(value: string | number) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? tooltipDateFormatter.format(new Date(timestamp)) : String(value);
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
