"use client";

import { Search } from "lucide-react";

import { DeviceCard } from "@/components/devices/device-card";
import { Input } from "@/components/ui/input";
import { useDeviceFilter } from "@/hooks/use-device-filter";
import type { DeviceView } from "@/features/devices/device.types";

export function DeviceSearchList({ devices }: { devices: DeviceView[] }) {
  const { query, setQuery, filteredDevices } = useDeviceFilter(devices);

  return (
    <section aria-label="Liste des appareils" className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="t-eyebrow">Fleet / devices</p>
          <p className="mt-2 text-sm text-ink-muted">
            {filteredDevices.length} appareil{filteredDevices.length > 1 ? "s" : ""} visible
            {filteredDevices.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <Input
            className="search-control h-10 pl-10"
            placeholder="Rechercher un appareil"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => <DeviceCard key={device.id} device={device} />)
        ) : (
          <div className="app-subtle-panel p-12 text-center">
            <p className="font-display text-lg font-semibold text-ink">Aucun appareil trouvé.</p>
            <p className="mt-1 text-sm text-ink-muted">Essayez un nom, un identifiant ou un lieu.</p>
          </div>
        )}
      </div>
    </section>
  );
}
