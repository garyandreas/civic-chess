import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const order = Number(body.moduleOrder ?? 0);
    const type = String(body.type ?? "video"); // "video" | "read" | "summary"

    const mod = await prisma.module.findUnique({ where: { order } });
    if (!mod) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    const existing = await prisma.moduleProgress.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId: mod.id } },
    });

    const readDone =
      type === "read" || type === "summary"
        ? true
        : existing?.readDone ?? false;
    const videoDone = type === "video" ? true : existing?.videoDone ?? false;
    const summaryDone =
      type === "summary" ? true : existing?.summaryDone ?? false;
    const quizDone = existing?.quizDone ?? false;
    const allDone = readDone && summaryDone && quizDone;

    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: mod.id } },
      update: {
        readDone,
        videoDone,
        summaryDone,
        completedAt: allDone ? existing?.completedAt ?? new Date() : null,
      },
      create: {
        userId: user.id,
        moduleId: mod.id,
        readDone,
        videoDone,
        summaryDone,
        quizDone: false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Progress update error:", err);
    return NextResponse.json({ error: "Gagal menyimpan progres" }, { status: 500 });
  }
}
