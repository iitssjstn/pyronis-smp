import { ShoppingBag, Check } from "lucide-react";
import { Panel } from "@/components/ui";

// PLACEHOLDER content — no real product names, prices, or perks are
// known yet, so these are clearly-marked examples to replace once
// Tebex is connected. Swap this whole array for the real catalog
// (or fetch it from Tebex) when that's ready — nothing here should
// ship to real players unedited.
const CATEGORIES = [
  {
    name: "Ranks",
    items: [
      { name: "VIP", perks: ["Colored chat", "1 extra /home", "VIP-only cosmetics"] },
      { name: "MVP", perks: ["Everything in VIP", "3 extra /homes", "Exclusive kit"] },
    ],
  },
  {
    name: "Crates & Keys",
    items: [{ name: "Vote Key", perks: ["Opens the Vote Crate", "Random cosmetic/economy rewards"] }],
  },
];

export default function StorePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
          <ShoppingBag size={20} />
        </span>
        <div>
          <h1 className="text-lg font-semibold">Store</h1>
          <p className="text-sm text-slate-400">A look at what's available. Checkout isn't live yet.</p>
        </div>
      </div>

      <Panel className="border-amber-500/30 bg-amber-500/5">
        <p className="text-sm text-amber-400">
          This is an information page only — there's no checkout yet. A real store (via Tebex) is coming soon.
        </p>
      </Panel>

      {CATEGORIES.map((category) => (
        <div key={category.name} className="space-y-3">
          <h2 className="text-sm font-medium text-slate-300">{category.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {category.items.map((item) => (
              <Panel key={item.name}>
                <h3 className="font-medium text-emerald-400">{item.name}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
                  {item.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-1.5">
                      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
