"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, Menu, RadioTower, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [{ label: "Appareils", href: "/", icon: LayoutDashboard }];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "/";
  const active = pathname === "/" || pathname.startsWith("/devices");

  return (
    <nav aria-label="Navigation principale">
      <ul>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2 px-3 py-2.5 no-underline transition-colors",
                  active
                    ? "bg-brand-wash text-brand"
                    : "text-ink-muted hover:bg-paper-sink hover:text-ink",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
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
    <div className="flex h-full flex-col gap-7 p-4">
      <Link href="/" onClick={onNavigate} className="group px-3 pt-1 no-underline">
        <span className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-2 bg-brand-wash text-brand transition-transform group-hover:-rotate-6">
            <RadioTower className="size-4" />
          </span>
          <span>
            <span className="block font-display text-[1.05rem] font-semibold leading-none tracking-[-0.03em] text-ink">
              Mathis IoT<span className="text-coral">.</span>
            </span>
            <span className="t-meta mt-1 block">Console</span>
          </span>
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-line bg-paper-lift lg:block">
        <Rail email={email} />
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-paper-lift/90 px-4 backdrop-blur-xl lg:hidden">
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

      <main className="min-h-screen lg:pl-56">
        <div className="mx-auto w-full max-w-[80rem] px-5 py-7 sm:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
