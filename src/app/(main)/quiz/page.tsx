import Link from "next/link";
import { Lock, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { calcMateriPct, isQuizUnlocked, QUIZ_UNLOCK_PCT } from "@/lib/progress";

export const dynamic = "force-dynamic";

const accentColors: Record<number, string> = {
  1: "#00529B",
  2: "#E55353",
  3: "#F1A7AD",
  4: "#F5B700",
};

export default async function QuizListPage({
  searchParams,
}: {
  searchParams: Promise<{ terkunci?: string }>;
}) {
  const sp = await searchParams;
  const lockedOrder = Number(sp.terkunci) || 0;

  const user = await requireUser();
  const [modules, progressList, attempts] = await Promise.all([
    prisma.module.findMany({
      orderBy: { order: "asc" },
      include: { quiz: true, _count: { select: { questions: true } } },
    }),
    prisma.moduleProgress.findMany({ where: { userId: user.id } }),
    prisma.quizAttempt.findMany({
      where: { userId: user.id },
      select: { quizId: true, score: true },
    }),
  ]);

  const lockedModule = modules.find((m) => m.order === lockedOrder);

  return (
    <div className="flex-1 bg-[#FDECEF] pb-16">
      <div className="bg-[#00529B] h-8 rounded-b-xl" />

      <section className="max-w-5xl mx-auto px-4 sm:px-10 mt-6">
        <h1 className="font-condensed-title text-3xl sm:text-4xl font-bold text-black leading-none">
          Quis
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-gray-800">
          Pilih Quis sesuai materi. Quis terbuka setelah seluruh halaman materi
          selesai dibaca (progres minimal {QUIZ_UNLOCK_PCT}%).
        </p>

        {lockedModule && (
          <div className="mt-5 bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm px-4 py-3 rounded-xl">
            🔒 Quis Materi {lockedModule.order} masih terkunci. Selesaikan dulu
            seluruh halaman{" "}
            <Link
              href={`/materi/${lockedModule.order}`}
              className="font-bold underline"
            >
              Materi {lockedModule.order}
            </Link>{" "}
            untuk membukanya.
          </div>
        )}

        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-6">
          {modules.map((m) => {
            const prog = progressList.find((p) => p.moduleId === m.id);
            const pct = calcMateriPct(prog);
            const unlocked = isQuizUnlocked(prog);
            const done = !!prog?.quizDone;
            const accent = accentColors[m.order] ?? "#00529B";
            const scores = attempts
              .filter((a) => a.quizId === m.quiz?.id)
              .map((a) => a.score);
            const bestScore = scores.length ? Math.max(...scores) : null;

            const cardInner = (
              <>
                <div
                  className="h-2 w-full rounded-t-2xl"
                  style={{ backgroundColor: unlocked ? accent : "#CBD5E1" }}
                />
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor: unlocked ? `${accent}1A` : "#F1F5F9",
                        color: unlocked ? accent : "#64748B",
                      }}
                    >
                      Quis Materi {m.order}
                    </span>
                    {done ? (
                      <CheckCircle2 className="w-6 h-6 text-[#2E8B19] shrink-0" />
                    ) : !unlocked ? (
                      <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : null}
                  </div>

                  <h2
                    className={`mt-3 text-base sm:text-lg font-bold leading-snug ${
                      unlocked ? "text-[#0B2545]" : "text-gray-500"
                    }`}
                  >
                    {m.title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-600">
                    {m._count.questions} soal pilihan ganda + soal esai
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-gray-700">
                        Progres Materi
                      </span>
                      <span className="font-bold" style={{ color: unlocked ? accent : "#64748B" }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: unlocked ? accent : "#94A3B8",
                        }}
                      />
                    </div>

                    <div className="mt-4">
                      {unlocked ? (
                        <span className="w-full inline-flex items-center justify-center gap-2 bg-[#00529B] text-white text-sm font-semibold py-2.5 rounded-xl group-hover:bg-[#003E75] transition">
                          <span>
                            {done
                              ? `Ulangi Quis${bestScore !== null ? ` • Skor terbaik ${bestScore}` : ""}`
                              : "Mulai Quis"}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-500 text-xs sm:text-sm font-semibold py-2.5 rounded-xl">
                          <BookOpen className="w-4 h-4" />
                          <span>Baca Materi {m.order} dulu</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );

            return unlocked ? (
              <Link
                key={m.id}
                href={`/quiz/${m.order}`}
                className="group bg-white border border-[#3A75B5] rounded-2xl flex flex-col min-h-[260px] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition"
              >
                {cardInner}
              </Link>
            ) : (
              <Link
                key={m.id}
                href={`/materi/${m.order}`}
                title={`Selesaikan seluruh halaman Materi ${m.order} untuk membuka Quis ini`}
                className="group bg-white/70 border border-dashed border-gray-300 rounded-2xl flex flex-col min-h-[260px]"
              >
                {cardInner}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
