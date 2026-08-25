import { notFound } from "next/navigation";

import { DeviceDetailView } from "@/components/devices/device-detail-view";
import { AppShell } from "@/components/layout/app-shell";
import { getDeviceDetails } from "@/features/devices/device.service";
import { getTelemetryForDevice, normalizeRange } from "@/features/telemetry/telemetry.service";
import { requireSession } from "@/server/require-auth";

export default async function DevicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  await requireSession();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const deviceId = decodeURIComponent(id);
  const range = normalizeRange(query.range ?? null);
  const [device, samples] = await Promise.all([
    getDeviceDetails(deviceId),
    getTelemetryForDevice(deviceId, range),
  ]);

  if (!device) notFound();

  return (
    <AppShell>
      <DeviceDetailView device={device} samples={samples} range={range} />
    </AppShell>
  );
}
