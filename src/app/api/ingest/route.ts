import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { fail, ok } from "@/lib/api-response";
import { getPublicClientIp } from "@/lib/request-ip";
import { ensureIndexes } from "@/server/indexes";
import { ingestDevicePayload } from "@/features/telemetry/telemetry.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await ensureIndexes();
    const payload = await request.json();
    const publicIp = getPublicClientIp(request);
    const queryDevice = request.nextUrl.searchParams.get("device");
    const result = await ingestDevicePayload(payload, publicIp, queryDevice);
    return ok(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return fail("Invalid device payload", 422);
    }
    if (error instanceof Error) {
      return fail(error.message, 400);
    }
    return fail("Unable to ingest payload", 500);
  }
}
