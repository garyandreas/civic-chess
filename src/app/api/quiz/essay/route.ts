import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isQuizUnlocked } from "@/lib/progress";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const moduleId = String(body.moduleId ?? "");
    const answers = body.answers ?? {};

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId wajib diisi" }, { status: 400 });
    }

    const progress = await prisma.moduleProgress.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId } },
    });
    if (!isQuizUnlocked(progress)) {
      return NextResponse.json(
        { error: "Quis masih terkunci. Selesaikan seluruh halaman materi dulu." },
        { status: 403 }
      );
    }

    const existing = await prisma.essaySubmission.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId } },
    });

    await prisma.essaySubmission.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId } },
      update: { answers: JSON.stringify(answers) },
      create: {
        userId: user.id,
        moduleId,
        answers: JSON.stringify(answers),
      },
    });

    // Tambah +10 poin saat pertama kali mengumpulkan esai materi tersebut
    let bonusPoints = 0;
    if (!existing) {
      bonusPoints = 10;
      await prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: bonusPoints } },
      });
    }

    return NextResponse.json({ ok: true, bonusPoints });
  } catch (err) {
    console.error("Essay submit error:", err);
    return NextResponse.json({ error: "Gagal menyimpan esai" }, { status: 500 });
  }
}
