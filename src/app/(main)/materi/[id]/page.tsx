import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { MateriReaderClient } from "./materi-reader-client";

export const dynamic = "force-dynamic";

export default async function MateriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderNum = Number(id);

  const mod = await prisma.module.findFirst({
    where: Number.isFinite(orderNum) ? { order: orderNum } : { id },
    include: {
      sections: { orderBy: { order: "asc" } },
    },
  });

  if (!mod) notFound();

  await requireUser();

  return (
    <div className="flex-1 flex flex-col">
      {/* Breadcrumb bar merah muda */}
      <div className="bg-[#FDECEF] px-6 sm:px-14 py-5">
        <div className="max-w-5xl mx-auto text-base sm:text-xl font-semibold">
          <Link href="/" className="text-[#0B2545] hover:underline">
            Beranda
          </Link>{" "}
          /{" "}
          <Link href="/materi" className="text-[#0B2545] hover:underline">
            Materi
          </Link>{" "}
          / <span className="text-[#B45309]">{mod.title}</span>
        </div>
      </div>

      {/* Judul modul di latar putih */}
      <div className="bg-white px-6 sm:px-14 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-sm sm:text-base font-bold text-[#00529B] uppercase tracking-wide">
            Modul {mod.order} — {mod.title}
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#0B2545]">
            BAB III: Bhinneka Tunggal Ika sebagai Pemersatu Bangsa
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-800 leading-relaxed">
            {mod.description}
          </p>
        </div>
      </div>

      {/* Pembaca Materi per Halaman (Swipe & Gulir Depan-Belakang + Ringkasan di Halaman Terakhir) */}
      <MateriReaderClient
        moduleOrder={mod.order}
        moduleTitle={mod.title}
        sections={mod.sections}
        summary={mod.summary}
      />
    </div>
  );
}
