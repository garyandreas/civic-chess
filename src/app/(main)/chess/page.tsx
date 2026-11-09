import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { CIVIC_CHESS_QUESTIONS } from "@/lib/civic-chess-questions";
import { ChessGameClient } from "./[level]/chess-game-client";

export const dynamic = "force-dynamic";

export default async function ChessDefaultPage() {
  const user = await requireUser();
  const levels = await prisma.chessLevel.findMany({
    orderBy: { number: "asc" },
    include: {
      module: true,
    },
  });

  const lvl = levels[0];
  if (!lvl) {
    return <div className="p-10 text-center">Level belum tersedia.</div>;
  }

  return (
    <ChessGameClient
      levelId={lvl.id}
      levelNumber={lvl.number}
      levelTitle={lvl.title}
      difficulty={lvl.difficulty}
      botDepth={lvl.botDepth}
      blunderRate={lvl.blunderRate}
      moduleOrder={lvl.module.order}
      moduleTitle={lvl.module.title}
      initialPoints={user.points}
      questions={CIVIC_CHESS_QUESTIONS}
      allLevels={levels.map((l) => ({
        number: l.number,
        title: l.title,
      }))}
    />
  );
}
