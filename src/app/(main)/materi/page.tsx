import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const barColors: Record<number, string> = {
  1: "#00529B",
  2: "#E55353",
  3: "#F1A7AD",
  4: "#F5B700",
  5: "#9EE0EE",
  6: "#F9B8C0",
};

function calcModulePct(p?: {
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

export default async function MateriPage() {
  const user = await requireUser();
  const [modules, progressList] = await Promise.all([
    prisma.module.findMany({ orderBy: { order: "asc" } }),
    prisma.moduleProgress.findMany({ where: { userId: user.id } }),
  ]);

  const completedCount = progressList.filter((p) => p.quizDone).length;
  const totalModules = modules.length || 4;
  const overallPct = Math.round(
    modules.reduce((acc, m) => {
      const prog = progressList.find((p) => p.moduleId === m.id);
      return acc + calcModulePct(prog);
    }, 0) / totalModules
  );

  return (
    <div className="flex-1 bg-[#EBF0FD] pb-16">
      <div className="bg-[#00529B] h-10 rounded-b-xl" />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-7">
        <h1 className="font-condensed-title text-2xl sm:text-3xl font-bold text-[#0B2545]">
          Materi Pembelajaran
        </h1>
        <p className="mt-1.5 text-base sm:text-xl font-medium text-gray-800">
          {totalModules} modul PPKn BAB III: Bhinneka Tunggal Ika sebagai
          Pemersatu Bangsa
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m) => {
            const prog = progressList.find((p) => p.moduleId === m.id);
            const pct = calcModulePct(prog);
            const barColor = barColors[m.order] ?? m.color ?? "#00529B";

            return (
              <Link
                key={m.id}
                href={`/materi/${m.order}`}
                className="bg-white border border-[#3A75B5] rounded-xl p-5 flex flex-col justify-between min-h-[215px] hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#E6ECFA] text-[#00529B] flex items-center justify-center text-sm font-bold shrink-0">
                    {m.order}.
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-[#0B2545] leading-snug">
                    {m.title}
                  </h2>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-gray-700 leading-relaxed mb-3">
                    {m.subtitle}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-1.5">
                    <span className="font-medium">Progres Akun</span>
                    <span className="font-bold text-[#00529B]">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: barColor,
                        width: `${pct}%`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Progress Kamu di bagian bawah */}
        <div className="mt-12">
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3DBE23] rounded-full transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold">
            <span className="text-[#2E8B19]">
              Progress Kamu ({overallPct}%)
            </span>
            <span className="text-[#0B2545]">
              {completedCount} dari {totalModules} modul selesai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
