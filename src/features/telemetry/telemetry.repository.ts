import { ObjectId, type Collection } from "mongodb";

import { getDb } from "@/lib/mongodb";
import type { TelemetryDocument, TelemetrySample } from "@/features/telemetry/telemetry.types";

const collectionName = "telemetry";

async function collection(): Promise<Collection<TelemetryDocument>> {
  return (await getDb()).collection<TelemetryDocument>(collectionName);
}

export async function insertTelemetrySample(sample: TelemetryDocument) {
  const telemetry = await collection();
  await telemetry.insertOne(sample);
}

export async function findTelemetrySamples(params: {
  deviceId?: string;
  startDate?: Date;
  limit?: number;
}) {
  const telemetry = await collection();
  const filter: Record<string, unknown> = {};
  if (params.deviceId) filter.deviceId = params.deviceId;
  if (params.startDate) filter.receivedAt = { $gte: params.startDate };

  const cursor = telemetry.find(filter).sort({ receivedAt: -1 });
  if (params.limit !== undefined) cursor.limit(params.limit);

  const docs = await cursor.toArray();

  return docs.reverse().map(serializeTelemetrySample);
}

export async function findLatestTelemetrySamples(limit = 20) {
  const telemetry = await collection();
  const docs = await telemetry.find({}).sort({ receivedAt: -1 }).limit(limit).toArray();
  return docs.map(serializeTelemetrySample);
}

export function serializeTelemetrySample(
  doc: TelemetryDocument & { _id?: ObjectId },
): TelemetrySample {
  return {
    id: doc._id?.toString() ?? "",
    deviceId: doc.deviceId,
    receivedAt: doc.receivedAt.toISOString(),
    publicIp: doc.publicIp,
    readings: doc.readings,
    runtime: doc.runtime,
    network: doc.network,
    config: doc.config,
    sensors: doc.sensors,
    rawPayload: doc.rawPayload,
  };
}
