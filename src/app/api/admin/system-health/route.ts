import { NextResponse } from "next/server";
import fs from "node:fs";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, isSessionUser } from "@/lib/session";
import { env } from "@/lib/env";
import type { HealthStatus } from "@/lib/enums";

// All routes here touch the database/cookies at request time and
// must never be statically prerendered during `next build` (which
// runs against a placeholder DATABASE_URL with no real database).
export const dynamic = "force-dynamic";

interface Check {
  name: string;
  status: HealthStatus;
  detail: string;
}

export async function GET() {
  const session = requireAuth();
  if (!isSessionUser(session)) return session;
  const roleError = requireRole(session, "ADMIN", "OWNER");
  if (roleError) return roleError;

  const checks: Check[] = [];

  // Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.push({ name: "Database", status: "healthy", detail: "Reachable" });
  } catch (err) {
    checks.push({ name: "Database", status: "error", detail: (err as Error).message });
  }

  // Storage — data directory writable
  try {
    const testFile = `${env.STORAGE_LOCAL_PATH}/.health-check`;
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    checks.push({ name: "Storage", status: "healthy", detail: env.STORAGE_LOCAL_PATH });
  } catch (err) {
    checks.push({ name: "Storage", status: "error", detail: (err as Error).message });
  }

  return NextResponse.json({ checks });
}
