import { DeviceSearchList } from "@/components/devices/device-search-list";
import type { DeviceView } from "@/features/devices/device.types";

export function DeviceListView({ devices }: { devices: DeviceView[] }) {
  const online = devices.filter((device) => device.status === "online").length;
  const warning = devices.filter((device) => device.status === "warning").length;
  const offline = devices.filter((device) => device.status === "offline").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="t-h1">Appareils</h1>
          <p className="mt-2 text-sm text-ink-muted">État et télémétrie de votre parc connecté.</p>
        </div>
        <p className="t-meta">{online} / {devices.length} en ligne</p>
      </header>

      <section
        aria-label="Résumé de la flotte"
        className="grid grid-cols-2 overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-4"
      >
        <SummaryStat label="Total" value={devices.length} />
        <SummaryStat label="En ligne" value={online} tone="turquoise" />
        <SummaryStat label="À surveiller" value={warning} tone="saffron" />
        <SummaryStat label="Hors ligne" value={offline} tone="coral" />
      </section>

      <DeviceSearchList devices={devices} />
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone = "azure",
}: {
  label: string;
  value: number;
  tone?: "azure" | "turquoise" | "saffron" | "coral";
}) {
  const toneClass = {
    azure: "text-brand",
    turquoise: "text-turquoise",
    saffron: "text-saffron",
    coral: "text-coral",
  }[tone];

  return (
    <div className="bg-paper-lift px-4 py-4 sm:px-5">
      <span className="data-label">{label}</span>
      <p className={`mt-3 font-display text-3xl font-semibold tracking-[-0.04em] ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
