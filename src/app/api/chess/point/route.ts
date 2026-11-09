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
    const delta = Number(body.delta ?? 0);
    const nextPoints = Math.max(0, user.points + delta);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { points: nextPoints },
    });

    return NextResponse.json({ points: updated.points });
  } catch (err) {
    console.error("Chess point error:", err);
    return NextResponse.json({ error: "Gagal update poin" }, { status: 500 });
  }
}
