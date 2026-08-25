"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants invalides.");
        return;
      }

      router.replace(searchParams.get("callbackUrl") ?? "/");
      router.refresh();
    });
  }

  return (
    <Card className="app-card w-full max-w-sm justify-self-center">
      <CardHeader className="gap-3 p-6 sm:p-7">
        <p className="t-eyebrow t-eyebrow-brand">Access / credentials</p>
        <CardTitle className="font-display text-2xl font-semibold tracking-[-0.03em]">
          Ouvrir la console
        </CardTitle>
        <p className="text-sm leading-relaxed text-ink-muted">
          Authentifiez-vous pour consulter vos appareils et leur télémétrie.
        </p>
      </CardHeader>
      <CardContent className="border-t border-line p-6 sm:p-7">
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="data-label">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-10 rounded-2 border-line-strong bg-transparent pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="data-label">
              Mot de passe
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="h-10 rounded-2 border-line-strong bg-transparent pl-10"
                required
              />
            </div>
          </div>
          {error ? (
            <p role="alert" className="rounded-2 border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button className="h-10 w-full rounded-full font-mono text-xs uppercase tracking-wider" disabled={pending}>
            {pending ? "Connexion..." : "Entrer dans la console"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
