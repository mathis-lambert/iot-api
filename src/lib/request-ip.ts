import type { NextRequest } from "next/server";

export function getPublicClientIp(request: NextRequest) {
  const candidates = [
    request.headers.get("true-client-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    ...splitForwardedFor(request.headers.get("x-forwarded-for")),
    ...splitForwardedHeader(request.headers.get("forwarded")),
  ].filter(Boolean) as string[];

  return candidates.map(cleanIp).find((ip) => ip && isPublicIp(ip)) ?? null;
}

function splitForwardedFor(value: string | null) {
  return value?.split(",").map((part) => part.trim()) ?? [];
}

function splitForwardedHeader(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .flatMap((entry) => entry.split(";"))
    .map((part) => part.trim())
    .filter((part) => part.toLowerCase().startsWith("for="))
    .map((part) => part.slice(4));
}

function cleanIp(value: string) {
  const cleaned = value
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/^\[|\]$/g, "")
    .replace(/^::ffff:/i, "");

  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(cleaned)) {
    return cleaned.split(":")[0];
  }

  return cleaned;
}

function isPublicIp(ip: string) {
  if (!ip || ip === "unknown") return false;
  if (ip.includes(".")) return isPublicIpv4(ip);
  return isPublicIpv6(ip);
}

function isPublicIpv4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  if (a === 169 && b === 254) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  return true;
}

function isPublicIpv6(ip: string) {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return false;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return false;
  if (normalized.startsWith("fe80")) return false;
  return normalized.includes(":");
}
