import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const rawUsername = String(body.username ?? "")
      .toLowerCase()
      .trim()
      .replace(/^@/, "")
      .replace(/[^a-z0-9_.-]/g, "");
    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");
    const className = String(body.className ?? "XI IPA 1").trim() || "XI IPA 1";
    const school = String(body.school ?? "SMA Negeri 1").trim() || "SMA Negeri 1";
    const bio =
      String(body.bio ?? "Pelajar PPKn Civic Chess").trim() ||
      "Pelajar PPKn Civic Chess";
    const avatarColor = String(body.avatarColor ?? "#A7F3D0").trim() || "#A7F3D0";
    const roleRaw = String(body.role ?? "STUDENT").toUpperCase();
    const role: Role = roleRaw === "TEACHER" ? "TEACHER" : "STUDENT";

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        { error: "Nama, email, dan password (minimal 6 karakter) wajib diisi." },
        { status: 400 }
      );
    }

    const username =
      rawUsername ||
      email.split("@")[0].replace(/[^a-z0-9_.-]/g, "") +
        Math.floor(10 + Math.random() * 90);

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username sudah dipakai pengguna lain. Pilih username lain." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        role,
        className,
        school,
        bio,
        avatarColor,
        points: 0,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat profil." },
      { status: 500 }
    );
  }
}
