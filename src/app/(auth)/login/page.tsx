import { prisma } from "@/lib/prisma";
import { LoginClient } from "./login-client";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      points: true,
      className: true,
      avatarColor: true,
    },
  });

  const accounts = users.map((u) => ({
    id: u.id,
    name: u.name,
    username: u.username ?? u.email.split("@")[0],
    email: u.email,
    points: u.points,
    className: u.className,
    avatarColor: u.avatarColor || "#A7F3D0",
  }));

  return <LoginClient accounts={accounts} />;
}
