import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { DeviceDocument, DeviceView } from "@/features/devices/device.types";
import { resolveDeviceStatus } from "@/features/devices/device-status";

const collectionName = "devices";

async function collection(): Promise<Collection<DeviceDocument>> {
  return (await getDb()).collection<DeviceDocument>(collectionName);
}

type DeviceUpsert = Omit<DeviceDocument, "firstSeenAt" | "lastPublicIp"> & {
  lastPublicIp?: string | null;
};

export async function upsertDevice(device: DeviceUpsert) {
  const now = device.lastSeenAt;
  const devices = await collection();
  const { lastPublicIp, ...baseDevice } = device;
  const $set: Partial<DeviceDocument> = {
    ...baseDevice,
  };
  if (lastPublicIp) {
    $set.lastPublicIp = lastPublicIp;
  }
  const $setOnInsert: Partial<DeviceDocument> = {
    firstSeenAt: now,
  };
  if (!lastPublicIp) {
    $setOnInsert.lastPublicIp = null;
  }

  await devices.updateOne(
    { _id: device._id },
    {
      $setOnInsert,
      $set,
      $unset: { status: "" },
    },
    { upsert: true },
  );
}

export async function findDevices() {
  const devices = await collection();
  const docs = await devices.find({}).sort({ lastSeenAt: -1 }).toArray();
  return docs.map(serializeDevice);
}

export async function findDeviceById(id: string) {
  const devices = await collection();
  const doc = await devices.findOne({ _id: id });
  return doc ? serializeDevice(doc) : null;
}

export function serializeDevice(doc: DeviceDocument): DeviceView {
  return {
    id: doc._id,
    name: doc.name,
    location: doc.location,
    firmware: doc.firmware,
    firstSeenAt: doc.firstSeenAt.toISOString(),
    lastSeenAt: doc.lastSeenAt.toISOString(),
    lastPublicIp: doc.lastPublicIp,
    status: resolveDeviceStatus(doc.lastSeenAt, doc.sendIntervalMs),
    sendIntervalMs: doc.sendIntervalMs,
    runtime: doc.runtime,
    network: doc.network,
    config: doc.config,
    sensors: doc.sensors,
    latestReadings: doc.latestReadings,
    latestPayload: doc.latestPayload,
  };
}
