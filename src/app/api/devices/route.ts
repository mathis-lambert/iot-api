import { fail, ok } from "@/lib/api-response";
import { getSession } from "@/features/auth/session";
import { getDeviceList } from "@/features/devices/device.service";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Unauthorized", 401);
  return ok(await getDeviceList());
}
