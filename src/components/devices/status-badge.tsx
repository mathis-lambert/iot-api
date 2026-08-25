import { CircleAlert, CircleCheck, CircleX } from "lucide-react";

import { statusLabel } from "@/features/devices/device-status";
import type { DeviceStatus } from "@/features/devices/device.types";

const styleByStatus: Record<DeviceStatus, string> = {
  online: "status-online",
  warning: "status-warning",
  offline: "status-offline",
};

const IconByStatus = {
  online: CircleCheck,
  warning: CircleAlert,
  offline: CircleX,
};

export function StatusBadge({ status }: { status: DeviceStatus }) {
  const Icon = IconByStatus[status];

  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[0.62rem] font-semibold uppercase tracking-wider ${styleByStatus[status]}`}
    >
      <Icon className="size-3" />
      {statusLabel(status)}
    </span>
  );
}
