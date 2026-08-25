import { getSession } from "@/features/auth/session";
import { AppShellClient } from "@/components/layout/app-shell-client";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <AppShellClient email={session?.user?.email ?? null}>
      {children}
    </AppShellClient>
  );
}
