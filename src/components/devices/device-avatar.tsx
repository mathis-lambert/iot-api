import { Cpu } from "lucide-react";

export function DeviceAvatar() {
  return (
    <div className="grid aspect-square w-full max-w-28 place-items-center rounded-[1.5rem] border border-line bg-paper-sink p-3">
      <div className="relative grid size-full place-items-center rounded-[1rem] border border-brand-quiet bg-paper-lift shadow-sm">
        <Cpu className="size-8 text-brand" strokeWidth={1.5} />
        <span className="absolute right-3 top-3 size-1.5 rounded-full bg-turquoise shadow-[0_0_0_4px_var(--brand-wash)]" />
        <span className="absolute bottom-2 font-mono text-[0.5rem] uppercase tracking-widest text-ink-faint">
          node
        </span>
      </div>
    </div>
  );
}
