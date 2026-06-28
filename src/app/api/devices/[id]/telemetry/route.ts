import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api-response";
import { getSession } from "@/features/auth/session";
import { getTelemetryForDevice, normalizeRange } from "@/features/telemetry/telemetry.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);

  const { id } = await params;
  const range = normalizeRange(request.nextUrl.searchParams.get("range"));
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 500);
  return ok(await getTelemetryForDevice(id, range, Math.min(limit, 2000)));
}
