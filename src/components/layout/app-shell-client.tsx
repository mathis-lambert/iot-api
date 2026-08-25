"use client";

import Link from "next/link";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  RadioTower,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Appareils",
    description: "Inventaire et état",
    href: "/",
    icon: LayoutDashboard,
  },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  const isDevicesRoute = pathname === "/" || pathname.startsWith("/devices");

  return (
    <nav aria-label="Navigation principale" className="space-y-2">
      <p className="t-eyebrow mb-3 px-3">Workspace</p>
      {NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const active = isDevicesRoute && index === 0;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-2 px-3 py-2.5 no-underline transition-colors",
              active
                ? "bg-brand-wash text-brand"
                : "text-ink-muted hover:bg-paper-sink hover:text-ink",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="min-w-0">
              <span className="block font-mono text-[0.68rem] font-semibold uppercase tracking-wider">
                {item.label}
              </span>
              <span className="mt-0.5 block text-xs text-current/60">{item.description}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Rail({
  email,
  onNavigate,
}: {
  email: string | null;
  onNavigate?: () => void;
}) {

  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Link href="/" onClick={onNavigate} className="group px-3 pt-1 no-underline">
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-2 bg-brand-wash text-brand transition-transform group-hover:-rotate-6">
            <RadioTower className="size-4" />
          </span>
          <span>
            <span className="block font-display text-[1.05rem] font-semibold leading-none tracking-[-0.03em] text-ink">
              Mathis IoT<span className="text-coral">.</span>
            </span>
            <span className="t-eyebrow mt-1.5">Control plane</span>
          </span>
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>

      <div className="space-y-3">
        <div className="rounded-3 border border-line bg-paper-sink px-3 py-3">
          <p className="t-eyebrow text-turquoise">Private console</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Appareils, réseau et mesures au même endroit.
          </p>
        </div>
        <div className="flex items-center gap-1 border-t border-line pt-3">
          <ThemeToggle />
          <div className="min-w-0 flex-1 truncate px-2 font-mono text-[0.62rem] text-ink-faint">
            {email ?? "Session active"}
          </div>
          <SignOutButton>
            <LogOut />
          </SignOutButton>
        </div>
        <Link
          href="/api/health"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 font-mono text-[0.62rem] uppercase tracking-wider text-ink-faint no-underline transition-colors hover:text-brand"
        >
          <ExternalLink className="size-3.5" />
          API health
        </Link>
      </div>
    </div>
  );
}

export function AppShellClient({
  children,
  email,
}: {
  children: ReactNode;
  email: string | null;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div data-ink="azure" className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-line bg-paper-lift lg:block">
        <Rail email={email} />
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-paper-lift/90 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="grid size-8 place-items-center rounded-2 bg-brand-wash text-brand">
            <RadioTower className="size-4" />
          </span>
          <span className="font-display text-base font-semibold tracking-[-0.025em] text-ink">
            Mathis IoT<span className="text-coral">.</span>
          </span>
        </Link>
        <button
          type="button"
          className="grid size-9 place-items-center rounded-2 border border-line text-ink-muted transition-colors hover:bg-paper-sink hover:text-ink"
          aria-label="Ouvrir la navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
        >
          <Menu className="size-4" />
        </button>
      </header>

      {navOpen ? (
        <>
          <button
            type="button"
            aria-label="Fermer la navigation"
            className="fixed inset-0 z-40 cursor-default bg-ink/20 backdrop-blur-sm lg:hidden"
            onClick={() => setNavOpen(false)}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-paper-lift shadow-2xl lg:hidden"
            aria-label="Navigation mobile"
          >
            <div className="absolute right-4 top-4">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-2 text-ink-muted hover:bg-paper-sink hover:text-ink"
                aria-label="Fermer la navigation"
                onClick={() => setNavOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>
            <Rail email={email} onNavigate={() => setNavOpen(false)} />
          </aside>
        </>
      ) : null}

      <main className="min-h-screen lg:pl-60">
        <div className="mx-auto w-full max-w-[80rem] px-5 py-7 sm:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

