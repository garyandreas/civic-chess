import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    }
    if (typeof body.username === "string" && body.username.trim()) {
      const cleanUser = body.username
        .toLowerCase()
        .trim()
        .replace(/^@/, "")
        .replace(/[^a-z0-9_.-]/g, "");
      if (cleanUser && cleanUser !== user.username) {
        const taken = await prisma.user.findUnique({
          where: { username: cleanUser },
        });
        if (taken && taken.id !== user.id) {
          return NextResponse.json(
            { error: "Username tersebut sudah digunakan akun lain." },
            { status: 409 }
          );
        }
        data.username = cleanUser;
      }
    }
    if (typeof body.className === "string") {
      data.className = body.className.trim() || "XI IPA 1";
    }
    if (typeof body.school === "string") {
      data.school = body.school.trim() || "SMA Negeri 1";
    }
    if (typeof body.bio === "string") {
      data.bio = body.bio.trim();
    }
    if (typeof body.avatarColor === "string") {
      data.avatarColor = body.avatarColor.trim();
    }
    if (typeof body.role === "string") {
      const r = body.role.toUpperCase();
      if (r === "TEACHER" || r === "STUDENT") {
        data.role = r as Role;
      }
    }
    if (typeof body.notifEnabled === "boolean") {
      data.notifEnabled = body.notifEnabled;
    }
    if (typeof body.soundEnabled === "boolean") {
      data.soundEnabled = body.soundEnabled;
    }
    if (typeof body.publicProfile === "boolean") {
      data.publicProfile = body.publicProfile;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      username: updated.username,
      className: updated.className,
      school: updated.school,
      bio: updated.bio,
      avatarColor: updated.avatarColor,
      role: updated.role,
      notifEnabled: updated.notifEnabled,
      soundEnabled: updated.soundEnabled,
      publicProfile: updated.publicProfile,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui profil." },
      { status: 500 }
    );
  }
}
