import { redirect } from "next/navigation";
import { RadioTower } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/features/auth/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="flex w-full max-w-4xl flex-col items-center gap-8 md:grid md:grid-cols-[1fr_390px]">
        <section className="w-full space-y-5">
          <div className="grid size-12 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <RadioTower className="size-5" />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">iot.mathislambert.fr</p>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Maison connectée
            </h1>
            <p className="max-w-md text-base text-muted-foreground">
              Appareils, mesures et état réseau dans une console privée.
            </p>
          </div>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
