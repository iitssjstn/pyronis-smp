import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { AdminShell } from "@/components/AdminShell";
import { AdminOverviewClient } from "./AdminOverviewClient";

export default function AdminPage() {
  const user = getSessionUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN" && user.role !== "OWNER") redirect("/");
  return (
    <AdminShell>
      <AdminOverviewClient />
    </AdminShell>
  );
}
