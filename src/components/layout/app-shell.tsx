import Link from "next/link";
import { Home, LogOut, RadioTower } from "lucide-react";
import { getSession } from "@/features/auth/session";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <RadioTower className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-wide">Mathis IoT</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/">
                <Home className="size-4" />
                Appareils
              </Link>
            </Button>
            <div className="hidden max-w-[180px] truncate text-sm text-muted-foreground md:block">
              {session?.user?.email}
            </div>
            <SignOutButton>
              <LogOut className="size-4" />
            </SignOutButton>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
    </div>
  );
}
