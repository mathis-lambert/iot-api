export type JsonObject = Record<string, unknown>;

export type DevicePayloadV1 = {
  device: {
    id: string;
    firmware: string;
    location: string;
    [key: string]: unknown;
  };
  runtime: {
    uptime_ms: number;
    sequence: number;
    success_count: number;
    failure_count: number;
    wifi_reconnect_count: number;
    [key: string]: unknown;
  };
  network: {
    ssid: string;
    local_ip: string;
    api_host: string;
    api_ip: string;
    api_port: number;
    [key: string]: unknown;
  };
  config: {
    send_interval_ms: number;
    retry_interval_ms: number;
    temperature_offset_c?: number;
    sample_count?: number;
    [key: string]: unknown;
  };
  sensors: JsonObject;
  telemetry: Record<string, number>;
  [key: string]: unknown;
};

export type MetricReading = {
  key: string;
  label: string;
  value: number;
  unit: string | null;
};

export type TelemetrySample = {
  id: string;
  deviceId: string;
  receivedAt: string;
  publicIp: string | null;
  readings: MetricReading[];
  runtime: DevicePayloadV1["runtime"];
  network: DevicePayloadV1["network"];
  config: DevicePayloadV1["config"];
  sensors: JsonObject;
  rawPayload: DevicePayloadV1;
};

export type TelemetryDocument = Omit<TelemetrySample, "id" | "receivedAt"> & {
  receivedAt: Date;
};

export type TelemetryRange = "1h" | "6h" | "24h" | "7d" | "30d";
