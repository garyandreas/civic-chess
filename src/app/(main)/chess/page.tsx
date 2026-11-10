import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ChessRookIcon } from "@/components/navbar";

export const dynamic = "force-dynamic";

const DIFFICULTY_LABEL: Record<string, { label: string; cls: string }> = {
  EASY: { label: "Mudah", cls: "bg-[#DCF5D3] text-[#1F6F12]" },
  MEDIUM: { label: "Sedang", cls: "bg-[#FFF1C2] text-[#8A5A00]" },
  HARD: { label: "Sulit", cls: "bg-[#FDD5D5] text-[#9B1C1C]" },
};

export default async function ChessListPage() {
  const user = await requireUser();
  const [levels, games] = await Promise.all([
    prisma.chessLevel.findMany({
      orderBy: { number: "asc" },
      include: { module: true },
    }),
    prisma.chessGame.findMany({
      where: { userId: user.id },
      select: { levelId: true, result: true },
    }),
  ]);

  return (
    <div className="flex-1 bg-[#EBF0FD] pb-16">
      <section className="bg-[#E8BDB9] py-8 px-6 rounded-b-2xl text-center">
        <h1 className="font-condensed-title text-4xl sm:text-5xl font-bold text-[#083B6B] tracking-wide uppercase">
          CIVIC CHESS
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#083B6B]/90 font-medium">
          Pilih materi, lalu kalahkan bot sambil menjawab soal PPKn setiap
          beberapa langkah.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-10 mt-8">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-6">
          {levels.map((lvl) => {
            const myGames = games.filter((g) => g.levelId === lvl.id);
            const wins = myGames.filter((g) => g.result === "WIN").length;
            const diff = DIFFICULTY_LABEL[lvl.difficulty] ?? DIFFICULTY_LABEL.EASY;

            return (
              <Link
                key={lvl.id}
                href={`/chess/${lvl.number}`}
                className="group bg-white border border-[#3A75B5] rounded-2xl flex flex-col min-h-[260px] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition overflow-hidden"
              >
                {/* Strip papan catur hitam-putih */}
                <div className="h-3 w-full grid grid-cols-16">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className={i % 2 === 0 ? "bg-[#1C1C1C]" : "bg-[#F2F2F2]"}
                    />
                  ))}
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#E6ECFA] text-[#00529B]">
                      <ChessRookIcon className="w-3.5 h-3.5" />
                      Materi {lvl.module.order}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${diff.cls}`}
                    >
                      {diff.label}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base sm:text-lg font-bold leading-snug text-[#0B2545]">
                    {lvl.module.title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    {lvl.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between text-xs text-gray-700 mb-3">
                      <span>{myGames.length}× dimainkan</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#B45309]">
                        <Trophy className="w-3.5 h-3.5" />
                        {wins} menang
                      </span>
                    </div>
                    <span className="w-full inline-flex items-center justify-center gap-2 bg-[#1C1C1C] text-white text-sm font-semibold py-2.5 rounded-xl group-hover:bg-black transition">
                      <span>Main Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
