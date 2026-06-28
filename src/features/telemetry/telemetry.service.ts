import { z } from "zod";
import { upsertDevice } from "@/features/devices/device.repository";
import { insertTelemetrySample, findTelemetrySamples } from "@/features/telemetry/telemetry.repository";
import {
  parseDevicePayload,
  rangeToStartDate,
  toMetricReadings,
} from "@/features/telemetry/telemetry.parser";
import type { TelemetryDocument } from "@/features/telemetry/telemetry.types";

export async function ingestDevicePayload(input: unknown, publicIp: string | null, queryDevice?: string | null) {
  const payload = parseDevicePayload(input);

  if (queryDevice && queryDevice !== payload.device.id) {
    throw new Error("Query device does not match payload device.id");
  }

  const receivedAt = new Date();
  const readings = toMetricReadings(payload);
  const sample: TelemetryDocument = {
    deviceId: payload.device.id,
    receivedAt,
    publicIp,
    readings,
    runtime: payload.runtime,
    network: payload.network,
    config: payload.config,
    sensors: payload.sensors,
    rawPayload: payload,
  };

  await insertTelemetrySample(sample);
  await upsertDevice({
    _id: payload.device.id,
    name: humanizeDeviceName(payload.device.id),
    location: payload.device.location,
    firmware: payload.device.firmware,
    lastSeenAt: receivedAt,
    lastPublicIp: publicIp ?? undefined,
    sendIntervalMs: payload.config.send_interval_ms,
    runtime: payload.runtime,
    network: payload.network,
    config: payload.config,
    sensors: payload.sensors,
    latestReadings: readings,
    latestPayload: payload,
  });

  return {
    deviceId: payload.device.id,
    receivedAt: receivedAt.toISOString(),
    readings,
  };
}

export async function getTelemetryForDevice(deviceId: string, range: string | null, limit?: number) {
  return findTelemetrySamples({
    deviceId,
    startDate: rangeToStartDate(range),
    limit,
  });
}

const rangeSchema = z.enum(["1h", "6h", "24h", "7d", "30d"]).catch("24h");

export function normalizeRange(range: string | null) {
  return rangeSchema.parse(range ?? "24h");
}

function humanizeDeviceName(id: string) {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => (/^[a-z]+\d+$/i.test(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}
