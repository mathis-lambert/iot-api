import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/features/devices/device-status";
import type { DeviceStatus } from "@/features/devices/device.types";

const styleByStatus: Record<DeviceStatus, string> = {
  online: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-200",
  warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200",
  offline: "border-border bg-muted text-muted-foreground",
};

const IconByStatus = {
  online: CircleCheck,
  warning: CircleAlert,
  offline: CircleX,
};

export function StatusBadge({ status }: { status: DeviceStatus }) {
  const Icon = IconByStatus[status];
  return (
    <Badge variant="outline" className={styleByStatus[status]}>
      <Icon className="size-3" />
      {statusLabel(status)}
    </Badge>
  );
}
