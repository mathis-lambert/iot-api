"use client";

import { useMemo, useState } from "react";
import type { DeviceView } from "@/features/devices/device.types";

export function useDeviceFilter(devices: DeviceView[]) {
  const [query, setQuery] = useState("");

  const filteredDevices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return devices;

    return devices.filter((device) => {
      const haystack = [
        device.id,
        device.name,
        device.location,
        device.status,
        device.network.local_ip,
        device.lastPublicIp ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [devices, query]);

  return { query, setQuery, filteredDevices };
}
