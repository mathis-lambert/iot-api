import { RadioTower } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getSession } from "@/features/auth/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper">
      <div className="pointer-events-none absolute -right-32 -top-48 size-[34rem] rounded-full bg-brand-wash blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-paper-sink blur-3xl" />
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-20">
        <section className="max-w-xl space-y-8">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2 bg-brand-wash text-brand">
              <RadioTower className="size-5" />
            </span>
            <span className="t-eyebrow t-eyebrow-brand">iot.mathislambert.fr</span>
          </div>
          <div className="space-y-5">
            <p className="section-kicker t-eyebrow">Private device console</p>
            <h1 className="t-display">Maison connectée.</h1>
            <p className="t-lead max-w-md">
              Appareils, mesures et état réseau dans une console privée, pensée pour rester lisible
              quand la maison tourne déjà.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
            <span className="t-meta text-turquoise">auth / protected</span>
            <span className="t-meta">telemetry / live</span>
            <span className="t-meta">api / internal</span>
          </div>
        </section>

        <LoginForm />
      </div>
    </main>
  );
}
