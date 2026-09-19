import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight, ShoppingBag, CheckCircle2, Wheat, Coins, Sparkles, Box, Users, MessageCircle, Trophy } from "lucide-react";
import { Panel } from "@/components/ui";
import { ServerIllustration } from "@/components/ServerIllustration";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TRUST_ITEMS = ["Skyblock gamemode", "Active staff", "Custom plugins", "Regular events"];

const FEATURES = [
  {
    icon: Wheat,
    title: "01 · Skyblock",
    text: "Start on your own floating island and build it up from nothing — a classic Skyblock experience with a custom economy on top.",
  },
  {
    icon: Coins,
    title: "02 · Economy & Shops",
    text: "Trade with other players, earn from your island, and spend it in the in-game shops or the server store.",
  },
  {
    icon: Users,
    title: "03 · Community",
    text: "An active community with regular events and a helpful, friendly staff team keeping things fair.",
  },
];

const STATS = [
  { icon: Zap, label: "Skyblock", sub: "Start with nothing, build everything" },
  { icon: Trophy, label: "Events", sub: "Regular community events" },
  { icon: Sparkles, label: "Custom", sub: "Custom plugins & economy" },
  { icon: Users, label: "Community", sub: "Active, friendly players" },
];

export default async function HomePage() {
  const rows = await prisma.systemSetting.findMany({ where: { key: { in: ["serverIp", "discordUrl"] } } });
  const settings = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
  const serverIp = settings.serverIp || "play.pyronissmp.net";
  const discordUrl = settings.discordUrl || "";

  return (
    // Homepage-level background: one continuous layer behind hero +
    // features + CTA + USPs (not scoped to the hero alone). Breaks out
    // to full viewport width; the actual content stays in its own
    // centered max-w-[1700px] wrapper on top, same as before.
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image src="/images/hero-bg.png" alt="" fill priority className="object-cover object-top" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1700px] space-y-8 px-8 py-10 sm:px-12">
        {/* Hero — no card, no background of its own (that lives at the
            homepage level above), just content sitting on it. */}
        <section className="grid gap-3 py-2 lg:grid-cols-[11fr_9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-xs tracking-widest text-emerald-400">
              <Wheat size={13} />
              SKYBLOCK
            </span>

            <h1 className="mt-2 text-[46px] font-bold leading-[1.05] tracking-tight">
              Welcome to
              <br />
              <span className="whitespace-nowrap text-emerald-400">Pyronis SMP.</span>
            </h1>

            <p className="mt-2 max-w-xl text-slate-400">
              A Skyblock Minecraft server where you start on your own floating island and build your way up —
              custom economy, active community, and regular events.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 font-mono text-sm text-emerald-400">
                <Box size={16} />
                {serverIp}
              </div>
              <Link
                href="/store"
                className="flex items-center gap-2 rounded-md border border-base-600 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-base-800"
              >
                <ShoppingBag size={16} />
                Visit Store
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              {TRUST_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ServerIllustration />
        </section>

        {/* Feature strip — a real grid, sitting on the same background;
            the panels have their own dark fill, the gaps between them
            let the homepage background show through. */}
        <section className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <Panel key={title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                <Icon size={17} />
              </span>
              <h3 className="mt-3 font-mono text-sm text-emerald-400">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </Panel>
          ))}
        </section>

        {/* Bottom CTA banner — only shown once a real Discord invite is
            set in Admin -> Settings, so this never links to a dead "#". */}
        {discordUrl && (
          <section className="flex flex-col gap-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                <MessageCircle size={20} />
              </span>
              <div>
                <p className="font-semibold text-emerald-400">Join the community.</p>
                <p className="text-sm text-slate-400">Hop on Discord to chat, get help, and stay up to date.</p>
              </div>
            </div>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-medium text-base-950 transition-colors hover:bg-emerald-400"
            >
              Join Discord
              <ArrowRight size={16} />
            </a>
          </section>
        )}

        {/* Stats row — directly on the background, no card */}
        <section className="grid gap-6 border-t border-base-700/60 pt-8 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={18} className="text-emerald-400" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
