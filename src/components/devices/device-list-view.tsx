import { Activity, CheckCircle2, Server, TriangleAlert } from "lucide-react";

import { DeviceSearchList } from "@/components/devices/device-search-list";
import type { DeviceView } from "@/features/devices/device.types";

export function DeviceListView({ devices }: { devices: DeviceView[] }) {
  const online = devices.filter((device) => device.status === "online").length;
  const warning = devices.filter((device) => device.status === "warning").length;
  const offline = devices.filter((device) => device.status === "offline").length;

  return (
    <div className="space-y-10">
      <header className="space-y-5">
        <p className="section-kicker t-eyebrow t-eyebrow-brand">Device inventory / live fleet</p>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1 className="t-h1">Votre maison, en un coup d’œil.</h1>
            <p className="t-lead">
              Un poste de contrôle calme pour suivre les appareils connectés, leur état réseau
              et les mesures qui remontent du terrain.
            </p>
          </div>
          <p className="t-meta shrink-0">iot.mathislambert.fr / console</p>
        </div>
      </header>

      <section
        aria-label="Résumé de la flotte"
        className="grid grid-cols-2 overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-4"
      >
        <SummaryStat icon={Server} label="Appareils" value={devices.length} />
        <SummaryStat icon={CheckCircle2} label="En ligne" value={online} tone="turquoise" />
        <SummaryStat icon={TriangleAlert} label="À surveiller" value={warning} tone="saffron" />
        <SummaryStat icon={Activity} label="Hors ligne" value={offline} tone="coral" />
      </section>

      <DeviceSearchList devices={devices} />
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  tone = "azure",
}: {
  icon: typeof Server;
  label: string;
  value: number;
  tone?: "azure" | "turquoise" | "saffron" | "coral";
}) {
  return (
    <div className="bg-paper-lift px-4 py-4 sm:px-5">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 text-${tone}`} />
        <span className="data-label">{label}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-ink">
        {value}
      </p>
    </div>
  );
}
