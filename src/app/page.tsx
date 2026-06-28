import { DeviceListView } from "@/components/devices/device-list-view";
import { AppShell } from "@/components/layout/app-shell";
import { getDeviceList } from "@/features/devices/device.service";
import { requireSession } from "@/server/require-auth";

export default async function Home() {
  await requireSession();
  const devices = await getDeviceList();

  return (
    <AppShell>
      <DeviceListView devices={devices} />
    </AppShell>
  );
}
