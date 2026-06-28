"use client";

import { Search } from "lucide-react";
import { DeviceCard } from "@/components/devices/device-card";
import { Input } from "@/components/ui/input";
import { useDeviceFilter } from "@/hooks/use-device-filter";
import type { DeviceView } from "@/features/devices/device.types";

export function DeviceSearchList({ devices }: { devices: DeviceView[] }) {
  const { query, setQuery, filteredDevices } = useDeviceFilter(devices);

  return (
    <>
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="bg-card pl-9"
          placeholder="Rechercher un appareil"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <section className="space-y-4">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => <DeviceCard key={device.id} device={device} />)
        ) : (
          <div className="app-subtle-panel p-10 text-center text-muted-foreground">
            Aucun appareil trouvé.
          </div>
        )}
      </section>
    </>
  );
}
