import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { QuizRunner } from "./quiz-runner";

export const dynamic = "force-dynamic";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderNum = Number(id);
  const user = await requireUser();

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      quiz: true,
      questions: true,
    },
  });

  const mod = modules.find((m) =>
    Number.isFinite(orderNum) ? m.order === orderNum : m.id === id
  );

  if (!mod || !mod.quiz) notFound();

  const savedEssay = await prisma.essaySubmission.findUnique({
    where: { userId_moduleId: { userId: user.id, moduleId: mod.id } },
  });

  const questions = mod.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: JSON.parse(q.options) as string[],
    answerIndex: q.answerIndex,
    explanation: q.explanation,
  }));

  const moduleList = modules.map((m) => ({
    order: m.order,
    title: m.title,
  }));

  let initialEssays: Record<number, string> = {};
  if (savedEssay?.answers) {
    try {
      initialEssays = JSON.parse(savedEssay.answers);
    } catch {
      initialEssays = {};
    }
  }

  return (
    <QuizRunner
      moduleOrder={mod.order}
      moduleId={mod.id}
      moduleTitle={mod.title}
      quizId={mod.quiz.id}
      questions={questions}
      moduleList={moduleList}
      initialEssayAnswers={initialEssays}
    />
  );
}
