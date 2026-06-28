import { DeviceSearchList } from "@/components/devices/device-search-list";
import type { DeviceView } from "@/features/devices/device.types";

export function DeviceListView({ devices }: { devices: DeviceView[] }) {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Appareils</h1>
          <p className="text-muted-foreground">Bienvenue chez vous</p>
        </div>
      </section>
      <DeviceSearchList devices={devices} />
    </div>
  );
}
