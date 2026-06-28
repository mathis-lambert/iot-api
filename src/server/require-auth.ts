import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
