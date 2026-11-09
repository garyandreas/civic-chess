import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 });
    }

    const body = await req.json();
    const moduleId = String(body.moduleId ?? "");
    const quizId = String(body.quizId ?? "");
    const correct = Number(body.correct ?? 0);
    const total = Math.max(1, Number(body.total ?? 1));

    const score = Math.round((correct / total) * 100);
    const pointsEarned = correct * 5;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        correct,
        total,
        score,
        points: pointsEarned,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: pointsEarned } },
    });

    if (moduleId) {
      await prisma.moduleProgress.upsert({
        where: { userId_moduleId: { userId: user.id, moduleId } },
        update: {
          readDone: true,
          summaryDone: true,
          quizDone: true,
          completedAt: new Date(),
        },
        create: {
          userId: user.id,
          moduleId,
          readDone: true,
          videoDone: true,
          summaryDone: true,
          quizDone: true,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      attemptId: attempt.id,
      score,
      pointsEarned,
    });
  } catch (err) {
    console.error("Quiz submit error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan hasil quiz." },
      { status: 500 }
    );
  }
}
