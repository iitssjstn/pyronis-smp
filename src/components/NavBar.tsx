"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "lucide-react";

// The account/login system still works (kept in the codebase for later —
// see /login, /register, /account) but is deliberately not linked from
// anywhere public yet, including here, until there's an actual reason
// for a player to log in (shop purchases tied to an account, etc.).
// Same reasoning applies to Admin — reachable directly by URL for
// whoever already knows to go there, not advertised in public nav.
const LINKS = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
];

export function NavBar() {
  const pathname = usePathname();

  // Admin Panel is its own application area with its own sidebar
  // (AdminShell) and must never show the normal public-site header.
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="border-b border-base-700 bg-base-900">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
            <Box size={18} />
          </span>
          <span className="text-sm font-semibold leading-tight tracking-tight">
            Pyronis <span className="text-emerald-400">SMP</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
