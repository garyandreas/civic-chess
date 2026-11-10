import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { CIVIC_CHESS_QUESTIONS } from "@/lib/civic-chess-questions";
import { ChessGameClient } from "./chess-game-client";

export const dynamic = "force-dynamic";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function ChessLevelPlayPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const num = Number(level);
  const user = await requireUser();

  const lvl = await prisma.chessLevel.findFirst({
    where: Number.isFinite(num) ? { number: num } : { id: level },
    include: {
      module: { include: { questions: true } },
    },
  });

  if (!lvl) notFound();

  // Soal pilihan ganda khusus materi ini (diacak), cadangan: soal umum Civic Chess
  const moduleQuestions = lvl.module.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: JSON.parse(q.options) as string[],
    answerIndex: q.answerIndex,
    explanation: q.explanation,
  }));
  const questions = shuffle(
    moduleQuestions.length > 0 ? moduleQuestions : CIVIC_CHESS_QUESTIONS
  );

  return (
    <ChessGameClient
      levelId={lvl.id}
      difficulty={lvl.difficulty}
      botDepth={lvl.botDepth}
      blunderRate={lvl.blunderRate}
      moduleOrder={lvl.module.order}
      moduleTitle={lvl.module.title}
      initialPoints={user.points}
      questions={questions}
    />
  );
}
