import type { DevicePayloadV1, MetricReading } from "@/features/telemetry/telemetry.types";

export type DeviceStatus = "online" | "warning" | "offline";

export type DeviceDocument = {
  _id: string;
  name: string;
  location: string;
  firmware: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  lastPublicIp: string | null;
  sendIntervalMs: number;
  runtime: DevicePayloadV1["runtime"];
  network: DevicePayloadV1["network"];
  config: DevicePayloadV1["config"];
  sensors: DevicePayloadV1["sensors"];
  latestReadings: MetricReading[];
  latestPayload: DevicePayloadV1;
};

export type DeviceView = Omit<DeviceDocument, "_id" | "firstSeenAt" | "lastSeenAt"> & {
  id: string;
  firstSeenAt: string;
  lastSeenAt: string;
  status: DeviceStatus;
};
