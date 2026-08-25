"use client";

import { Search } from "lucide-react";

import { DeviceCard } from "@/components/devices/device-card";
import { Input } from "@/components/ui/input";
import { useDeviceFilter } from "@/hooks/use-device-filter";
import type { DeviceView } from "@/features/devices/device.types";

export function DeviceSearchList({ devices }: { devices: DeviceView[] }) {
  const { query, setQuery, filteredDevices } = useDeviceFilter(devices);

  return (
    <section aria-label="Liste des appareils" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          {filteredDevices.length} appareil{filteredDevices.length > 1 ? "s" : ""}
        </p>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <Input
            className="search-control h-10 pl-10"
            placeholder="Rechercher"
            aria-label="Rechercher un appareil"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => <DeviceCard key={device.id} device={device} />)
        ) : (
          <div className="app-subtle-panel p-10 text-center text-sm text-ink-muted">
            Aucun appareil ne correspond à cette recherche.
          </div>
        )}
      </div>
    </section>
  );
}
