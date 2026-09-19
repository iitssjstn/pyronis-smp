import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = requireAdmin();
  if (!isSessionUser(session)) return session;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const recentAudit = await prisma.auditLog.findMany({
    where: { details: { contains: user.id } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { action: true, createdAt: true },
  });

  return NextResponse.json({ ...user, recentAudit });
}
