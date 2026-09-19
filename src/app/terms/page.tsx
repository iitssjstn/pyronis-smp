import { Panel } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const doc = await prisma.legalDocument.findUnique({ where: { type: "terms" } });

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-6 py-10">
      <h1 className="text-lg font-semibold">Terms of Service</h1>
      <Panel>
        {doc?.publishedContent ? (
          <p className="whitespace-pre-wrap text-sm text-slate-400">{doc.publishedContent}</p>
        ) : (
          <p className="text-sm text-slate-400">
            No Terms of Service have been published yet. Set them from Admin → Legal / Content.
          </p>
        )}
      </Panel>
    </div>
  );
}
