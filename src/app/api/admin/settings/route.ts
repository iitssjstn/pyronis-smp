import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, isSessionUser } from "@/lib/session";
import { audit } from "@/lib/audit";

// All routes here touch the database/cookies at request time and
// must never be statically prerendered during `next build` (which
// runs against a placeholder DATABASE_URL with no real database).
export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, string> = {
  siteName: "Pyronis SMP",
  registrationEnabled: "true",
  maintenanceMode: "false",
  serverIp: "play.pyronissmp.net",
  discordUrl: "",
};

export async function GET() {
  const session = requireAuth();
  if (!isSessionUser(session)) return session;
  const roleError = requireRole(session, "ADMIN", "OWNER");
  if (roleError) return roleError;

  const rows = await prisma.systemSetting.findMany();
  const settings = { ...DEFAULTS };
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

const settingsSchema = z.object({
  siteName: z.string().min(1).max(100).optional(),
  registrationEnabled: z.enum(["true", "false"]).optional(),
  maintenanceMode: z.enum(["true", "false"]).optional(),
  serverIp: z.string().max(100).optional(),
  discordUrl: z.string().max(300).optional(),
});

export async function PUT(req: NextRequest) {
  const session = requireAuth();
  if (!isSessionUser(session)) return session;
  // Settings (especially maintenance mode) are sensitive enough to
  // restrict to OWNER, same bar as AI provider keys.
  const roleError = requireRole(session, "OWNER");
  if (roleError) return roleError;

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value === undefined) continue;
    await prisma.systemSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  await audit(session.id, "settings.updated", parsed.data);

  const rows = await prisma.systemSetting.findMany();
  const settings = { ...DEFAULTS };
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}
