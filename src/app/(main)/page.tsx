import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ChessRookIcon, QuizPlusIcon } from "@/components/navbar";

export const dynamic = "force-dynamic";

function calcPercent(p?: {
  readDone: boolean;
  videoDone: boolean;
  summaryDone: boolean;
  quizDone: boolean;
}) {
  if (!p) return 0;
  if (p.quizDone) return 100;
  if (p.readDone && p.summaryDone) return 90;
  if (p.readDone || p.summaryDone || p.videoDone) return 45;
  return 0;
}

export default async function HomePage() {
  const user = await requireUser();
  const [modules, progressList, lastQuiz, lastChess, allStudents] =
    await Promise.all([
      prisma.module.findMany({ orderBy: { order: "asc" } }),
      prisma.moduleProgress.findMany({ where: { userId: user.id } }),
      prisma.quizAttempt.findFirst({
        where: { userId: user.id },
        include: { quiz: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.chessGame.findFirst({
        where: { userId: user.id },
        include: { level: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        where: { publicProfile: true },
        orderBy: [{ points: "desc" }, { name: "asc" }],
        select: { id: true },
      }),
    ]);

  const completedCount = progressList.filter((p) => p.quizDone).length;
  const totalModules = modules.length || 4;

  const rankIndex = allStudents.findIndex((s) => s.id === user.id);
  const rank = rankIndex >= 0 ? rankIndex + 1 : allStudents.length + 1;

  // Cari modul yang sedang dipelajari oleh akun ini
  const activeModule =
    modules.find((m) => {
      const p = progressList.find((pr) => pr.moduleId === m.id);
      return !p || !p.quizDone;
    }) ?? modules[0];

  const activeProgress = activeModule
    ? progressList.find((p) => p.moduleId === activeModule.id)
    : undefined;
  const activePct = calcPercent(activeProgress);

  const firstName = user.name.split(" ")[0];
  const points = user.points;
  const quizPct = lastQuiz ? lastQuiz.score : 0;
  const chessPct = lastChess
    ? lastChess.result === "WIN"
      ? 100
      : lastChess.result === "DRAW"
      ? 60
      : 30
    : 0;

  return (
    <div className="w-full pb-16">
      {/* Hero banner biru */}
      <section className="bg-[#00529B] text-white rounded-b-2xl px-6 sm:px-14 pt-10 pb-10 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
            Selamat datang, {firstName}!
            <br />
            Siap belajar hari ini?
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-[#D6EAFF] font-medium">
            Kamu sudah menyelesaikan {completedCount} dari {totalModules} modul.
            Teruskan semangatnya!
          </p>

          <div className="mt-8 flex flex-wrap justify-end gap-4">
            <Link
              href={activeModule ? `/materi/${activeModule.order}` : "/materi"}
              className="inline-flex items-center justify-center gap-2.5 bg-white text-[#0B2545] px-7 py-3 rounded-xl font-bold text-sm sm:text-base shadow-sm hover:bg-gray-100 transition"
            >
              <span className="inline-flex items-center">
                <Play className="w-4 h-4 fill-current" />
                <span className="w-1 h-4 bg-[#0B2545] ml-0.5 inline-block" />
              </span>
              <span>Lanjutkan</span>
            </Link>

            <Link
              href="/chess"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0B2545] px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-sm hover:bg-gray-100 transition"
            >
              <ChessRookIcon className="w-5 h-5" />
              <span>Main Sekarang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Kartu statistik & Aktivitas Terbaru */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          <div className="bg-[#9EE0EE] border border-[#6CC8DE] rounded-xl py-4 px-6 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00529B]">
              {completedCount}/{totalModules}
            </div>
            <div className="text-sm sm:text-base font-semibold text-[#0B2545] mt-0.5">
              Modul Selesai
            </div>
          </div>

          <div className="bg-[#9EE0EE] border border-[#6CC8DE] rounded-xl py-4 px-6 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00529B]">
              {points}
            </div>
            <div className="text-sm sm:text-base font-semibold text-[#0B2545] mt-0.5">
              Total Poin
            </div>
          </div>

          <div className="bg-[#9EE0EE] border border-[#6CC8DE] rounded-xl py-4 px-6 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00529B]">
              #{rank}
            </div>
            <div className="text-sm sm:text-base font-semibold text-[#0B2545] mt-0.5">
              Peringkat Kelas
            </div>
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="mt-10">
          <h2 className="text-base sm:text-lg font-extrabold text-[#B45309] uppercase tracking-wide">
            AKTIVITAS TERBARU
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 font-medium mt-0.5">
            Lanjutkan di sini
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
            {/* Kartu Modul */}
            <Link
              href={activeModule ? `/materi/${activeModule.order}` : "/materi/1"}
              className="border border-[#3A75B5] rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#DCEFD9] flex items-center justify-center text-[#2E7D32] mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-lg font-bold text-[#0B2545]">
                  Modul {activeModule?.order ?? 1}
                </div>
                <div className="text-xs sm:text-sm text-gray-700 mt-1 leading-snug">
                  {activeModule?.title ?? "Bhinneka Tunggal Ika"}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5989D] rounded-full transition-all"
                    style={{ width: `${activePct}%` }}
                  />
                </div>
                <div className="text-xs leading-tight text-right text-gray-800">
                  <div className="font-bold">{activePct}%</div>
                  <div className="text-[11px] text-gray-600">Selesai</div>
                </div>
              </div>
            </Link>

            {/* Kartu Civic Chess */}
            <Link
              href={
                lastChess ? `/chess/${lastChess.level.number}` : "/chess/1"
              }
              className="border border-[#3A75B5] rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#E6ECFA] flex items-center justify-center text-[#00529B] mb-3">
                  <ChessRookIcon className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-lg font-bold text-[#0B2545]">
                  Civic Chess
                </div>
                <div className="text-xs sm:text-sm text-gray-700 mt-1 leading-snug">
                  {lastChess
                    ? `Level ${lastChess.level.number} — ${lastChess.level.title}`
                    : "Level 1 — Mulai Main"}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4CD92B] rounded-full transition-all"
                    style={{ width: `${chessPct}%` }}
                  />
                </div>
                <div className="text-xs leading-tight text-right text-gray-800">
                  <div className="font-bold">{chessPct}%</div>
                  <div className="text-[11px] text-gray-600">Selesai</div>
                </div>
              </div>
            </Link>

            {/* Kartu Quiz terakhir */}
            <Link
              href="/quiz"
              className="border border-[#3A75B5] rounded-xl p-5 bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#F5D0D0] flex items-center justify-center text-[#A94442] mb-3">
                  <QuizPlusIcon className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-lg font-bold text-[#0B2545]">
                  Quiz terakhir
                </div>
                <div className="text-xs sm:text-sm text-gray-700 mt-1 leading-snug">
                  {lastQuiz
                    ? `Skor: ${lastQuiz.score}/100`
                    : "Belum dikerjakan"}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F5B700] rounded-full transition-all"
                    style={{ width: `${quizPct}%` }}
                  />
                </div>
                <div className="text-xs leading-tight text-right text-gray-800">
                  <div className="font-bold">{quizPct}%</div>
                  <div className="text-[11px] text-gray-600">Selesai</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
