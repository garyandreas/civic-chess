import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RingkasanPage({
  searchParams,
}: {
  searchParams: Promise<{ materi?: string }>;
}) {
  const sp = await searchParams;
  const focusOrder = Number(sp.materi) || 0;

  await getCurrentUser();
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex-1 bg-[#EBF0FD] pb-16">
      {/* Header biru melengkung sesuai gambar */}
      <section className="bg-[#00529B] text-white px-6 sm:px-14 py-9 rounded-b-2xl">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-condensed-title text-2xl sm:text-3xl font-bold tracking-wide">
            Ringkasan Materi
          </h1>
          <p className="mt-2 text-sm sm:text-base font-semibold text-white/95">
            Poin-poin penting dari setiap materi untuk kamu pelajari kembali
          </p>
        </div>
      </section>

      {/* Grid kartu ringkasan */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-7">
        {modules.map((m) => {
          const isFocused = m.order === focusOrder;
          return (
            <Link
              key={m.id}
              href={`/materi/${m.order}`}
              className={`bg-white border rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition ${
                isFocused
                  ? "border-[#00529B] ring-2 ring-[#00529B]/40"
                  : "border-[#3A75B5]"
              }`}
            >
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-[#0B2545] mb-2.5">
                  Materi {m.order} — {m.title}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                  {m.summary}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
