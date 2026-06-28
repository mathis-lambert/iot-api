import { findDeviceById, findDevices } from "@/features/devices/device.repository";
import { findLatestTelemetrySamples } from "@/features/telemetry/telemetry.repository";

export async function getDeviceList() {
  return findDevices();
}

export async function getDeviceDetails(id: string) {
  return findDeviceById(id);
}

export async function getLatestSamples(limit = 20) {
  return findLatestTelemetrySamples(limit);
}
