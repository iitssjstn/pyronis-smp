"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/ui";

interface RecentUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}
interface HealthCheck {
  name: string;
  status: "healthy" | "warning" | "error";
}

export function AdminOverviewClient() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [health, setHealth] = useState<HealthCheck[]>([]);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/admin/users"), fetch("/api/admin/system-health")]).then(
      async ([usersRes, healthRes]) => {
        if (usersRes.status === 403) {
          setForbidden(true);
          return;
        }
        if (usersRes.ok) {
          const data = await usersRes.json();
          setTotalUsers(data.total);
          setUsers(data.items.slice(0, 5));
        }
        if (healthRes.ok) setHealth((await healthRes.json()).checks);
      }
    );
  }, []);

  if (forbidden) return <p className="px-6 py-10 text-sm text-slate-500">You do not have access to the admin panel.</p>;

  return (
    <div className="space-y-6 px-6 py-10">
      <h2 className="text-base font-semibold">Overview</h2>

      {totalUsers !== null && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          <Panel className="text-center">
            <p className="text-2xl font-semibold text-emerald-400">{totalUsers}</p>
            <p className="mt-1 text-xs text-slate-500">Total Users</p>
          </Panel>
        </div>
      )}

      {health.length > 0 && (
        <Panel>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">System Health</h3>
            <Link href="/admin/health" className="text-xs text-emerald-400 hover:underline">
              View details
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {health.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    c.status === "healthy" ? "bg-emerald-500" : c.status === "warning" ? "bg-amber-500" : "bg-red-500"
                  }`}
                />
                {c.name}
              </span>
            ))}
          </div>
        </Panel>
      )}

      <Panel>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Recent Users</h3>
          <Link href="/admin/users" className="text-xs text-emerald-400 hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
          {users.length === 0 && <li className="text-xs text-slate-500">No users yet.</li>}
          {users.map((u) => (
            <li key={u.id} className="truncate">
              {u.username} <span className="text-slate-500">({u.email})</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
