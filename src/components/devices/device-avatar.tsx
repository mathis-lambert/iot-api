import { Cpu } from "lucide-react";

export function DeviceAvatar() {
  return (
    <div className="grid aspect-square w-full max-w-28 place-items-center rounded-lg border border-border bg-muted/55">
      <div className="relative grid size-16 place-items-center rounded-lg border border-border bg-card shadow-sm">
        <Cpu className="size-7 text-primary" />
        <span className="absolute right-3 top-3 size-1.5 rounded-full bg-cyan-400 dark:bg-cyan-300" />
      </div>
    </div>
  );
}
