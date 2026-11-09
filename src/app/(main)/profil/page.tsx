import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ProfilClient } from "./profil-client";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const user = await requireUser();

  const [progressList, quizAttempts, chessGames, totalModules] =
    await Promise.all([
      prisma.moduleProgress.findMany({
        where: { userId: user.id },
        include: { module: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.quizAttempt.findMany({
        where: { userId: user.id },
        include: { quiz: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.chessGame.findMany({
        where: { userId: user.id },
        include: { level: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.module.count(),
    ]);

  const completedModules = progressList.filter((p) => p.quizDone).length;

  const avgQuiz =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, a) => acc + a.score, 0) /
            quizAttempts.length
        )
      : 0;

  return (
    <ProfilClient
      user={{
        id: user.id,
        name: user.name,
        username: user.username ?? user.email.split("@")[0],
        email: user.email,
        role: user.role,
        className: user.className,
        school: user.school ?? "SMA Negeri 1",
        bio: user.bio ?? "Pelajar PPKn Civic Chess",
        avatarColor: user.avatarColor || "#A7F3D0",
        points: user.points,
        notifEnabled: user.notifEnabled,
        soundEnabled: user.soundEnabled,
        publicProfile: user.publicProfile,
      }}
      completedModules={completedModules}
      totalModules={totalModules || 4}
      avgScore={avgQuiz}
      quizHistory={quizAttempts.map((a) => ({
        id: a.id,
        title: a.quiz.title,
        score: a.score,
        points: a.points,
        correct: a.correct,
        total: a.total,
      }))}
      chessHistory={chessGames.map((g) => ({
        id: g.id,
        levelNumber: g.level.number,
        levelTitle: g.level.title,
        result: g.result,
        points: g.points,
      }))}
    />
  );
}
