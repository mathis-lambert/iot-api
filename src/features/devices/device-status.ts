import type { DeviceStatus } from "@/features/devices/device.types";

export function resolveDeviceStatus(lastSeenAt: Date, sendIntervalMs: number): DeviceStatus {
  const age = Date.now() - lastSeenAt.getTime();
  if (age <= sendIntervalMs * 2) return "online";
  if (age <= sendIntervalMs * 4) return "warning";
  return "offline";
}

export function statusLabel(status: DeviceStatus) {
  if (status === "online") return "En ligne";
  if (status === "warning") return "À vérifier";
  return "Hors ligne";
}
