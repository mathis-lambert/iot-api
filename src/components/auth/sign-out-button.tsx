"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Se déconnecter"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      {children}
    </Button>
  );
}
