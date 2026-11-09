import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { GameResult } from "@/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 });
    }

    const body = await req.json();
    const levelId = String(body.levelId ?? "");
    const resultRaw = String(body.result ?? "WIN").toUpperCase();
    const result: GameResult =
      resultRaw === "LOSE"
        ? "LOSE"
        : resultRaw === "DRAW"
        ? "DRAW"
        : "WIN";
    const questionsCorrect = Number(body.questionsCorrect ?? 0);
    const questionsTotal = Number(body.questionsTotal ?? 0);

    const basePoints =
      result === "WIN" ? 20 : result === "DRAW" ? 10 : 5;
    const points = basePoints + questionsCorrect * 5;

    const game = await prisma.chessGame.create({
      data: {
        userId: user.id,
        levelId,
        result,
        questionsCorrect,
        questionsTotal,
        points,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: points } },
    });

    return NextResponse.json({
      gameId: game.id,
      pointsEarned: points,
    });
  } catch (err) {
    console.error("Chess complete error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan hasil permainan." },
      { status: 500 }
    );
  }
}
