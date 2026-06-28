import { z } from "zod";
import type { DevicePayloadV1, MetricReading } from "@/features/telemetry/telemetry.types";

const looseObject = z.record(z.string(), z.unknown());

export const devicePayloadSchema = z
  .object({
    device: z
      .object({
        id: z.string().min(1),
        firmware: z.string().min(1),
        location: z.string().min(1),
      })
      .passthrough(),
    runtime: z
      .object({
        uptime_ms: z.number().nonnegative(),
        sequence: z.number().int().nonnegative(),
        success_count: z.number().int().nonnegative(),
        failure_count: z.number().int().nonnegative(),
        wifi_reconnect_count: z.number().int().nonnegative(),
      })
      .passthrough(),
    network: z
      .object({
        ssid: z.string(),
        local_ip: z.string(),
        api_host: z.string(),
        api_ip: z.string(),
        api_port: z.number().int().positive(),
      })
      .passthrough(),
    config: z
      .object({
        send_interval_ms: z.number().int().positive(),
        retry_interval_ms: z.number().int().positive(),
        temperature_offset_c: z.number().optional(),
        sample_count: z.number().int().positive().optional(),
      })
      .passthrough(),
    sensors: looseObject,
    telemetry: z.record(z.string(), z.number()),
  })
  .passthrough();

const knownUnits: Record<string, string> = {
  temperature_c: "degC",
  raw_temperature_c: "degC",
  humidity_percent: "%",
  pressure_hpa: "hPa",
};

export function parseDevicePayload(input: unknown): DevicePayloadV1 {
  return devicePayloadSchema.parse(input) as DevicePayloadV1;
}

export function metricLabel(key: string) {
  return key
    .replace(/_c$/, "")
    .replace(/_hpa$/, "")
    .replace(/_percent$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function metricUnit(key: string) {
  if (knownUnits[key]) return knownUnits[key];
  if (key.endsWith("_c")) return "degC";
  if (key.endsWith("_percent")) return "%";
  if (key.endsWith("_hpa")) return "hPa";
  return null;
}

export function toMetricReadings(payload: DevicePayloadV1): MetricReading[] {
  return Object.entries(payload.telemetry)
    .filter(([, value]) => Number.isFinite(value))
    .map(([key, value]) => ({
      key,
      label: metricLabel(key),
      value,
      unit: metricUnit(key),
    }));
}

export function rangeToStartDate(range: string | null | undefined) {
  const now = Date.now();
  const ranges: Record<string, number> = {
    "1h": 60 * 60_000,
    "6h": 6 * 60 * 60_000,
    "24h": 24 * 60 * 60_000,
    "7d": 7 * 24 * 60 * 60_000,
    "30d": 30 * 24 * 60 * 60_000,
  };
  return new Date(now - (ranges[range ?? ""] ?? ranges["24h"]));
}
